using Erp.Core.Authorization;
using Erp.Core.Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Erp.Infrastructure.Persistence.Seeding;

public static class DatabaseInitializer
{
    /// <summary>Migrate (if enabled), synchronise the permission catalog, then seed demo data (if enabled).</summary>
    public static async Task InitializeDatabaseAsync(this IServiceProvider services, CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope();
        var provider = scope.ServiceProvider;
        var options = provider.GetRequiredService<IOptions<DatabaseOptions>>().Value;
        var db = provider.GetRequiredService<ErpDbContext>();
        var logger = provider.GetRequiredService<ILoggerFactory>().CreateLogger(typeof(DatabaseInitializer));

        if (options.MigrateOnStartup)
        {
            var pending = (await db.Database.GetPendingMigrationsAsync(cancellationToken)).ToList();
            if (pending.Count > 0)
            {
                logger.LogInformation("Applying {Count} migration(s): {Migrations}", pending.Count, string.Join(", ", pending));
                await db.Database.MigrateAsync(cancellationToken);
            }
        }

        await SyncPermissionCatalogAsync(db, provider.GetRequiredService<PermissionCatalog>(), logger, cancellationToken);

        if (options.SeedDemoData)
        {
            await provider.GetRequiredService<DemoDataSeeder>().SeedAsync(cancellationToken);
        }
    }

    /// <summary>Inserts new permissions and refreshes descriptions. Removed permissions are kept (roles may reference them).</summary>
    private static async Task SyncPermissionCatalogAsync(
        ErpDbContext db, PermissionCatalog catalog, ILogger logger, CancellationToken cancellationToken)
    {
        var existing = await db.Permissions.ToDictionaryAsync(p => p.Code, cancellationToken);
        var added = 0;

        foreach (var definition in catalog.All)
        {
            if (existing.TryGetValue(definition.Code.Value, out var row))
            {
                row.Description = definition.Description;
                continue;
            }

            db.Permissions.Add(new Permission
            {
                Code = definition.Code.Value,
                Module = definition.Code.Module,
                Feature = definition.Code.Feature,
                Action = definition.Code.Action,
                Description = definition.Description,
            });
            added++;
        }

        await db.SaveChangesAsync(cancellationToken);
        if (added > 0) logger.LogInformation("Permission catalog: added {Count} permission(s)", added);
    }
}

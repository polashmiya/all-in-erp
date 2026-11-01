using Erp.Core.Domain.Navigation;
using Erp.Core.Modules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Erp.Infrastructure.Persistence.Seeding;

/// <summary>
/// Inserts ERP modules, sub-modules and features that code modules declare but the database does not have yet.
/// Existing rows are never overwritten: names, icons, order and active flags are edited in the database.
/// </summary>
public static class ErpMenuSynchronizer
{
    public static async Task SyncAsync(ErpDbContext db, ErpMenuCatalog catalog, ILogger logger, CancellationToken cancellationToken)
    {
        var modules = await db.ErpModules.Include(m => m.SubModules).ToListAsync(cancellationToken);
        var featureCodes = (await db.ErpFeatures.Select(f => f.Code).ToListAsync(cancellationToken)).ToHashSet();
        var added = new List<string>();

        foreach (var declared in catalog.Modules)
        {
            var module = modules.SingleOrDefault(m => m.Key == declared.Key);
            if (module is null)
            {
                module = new ErpModule
                {
                    Key = declared.Key,
                    NameEn = declared.Name.En,
                    NameBn = declared.Name.Bn,
                    Icon = declared.Icon,
                    SortOrder = declared.Order,
                };
                db.ErpModules.Add(module);
                modules.Add(module);
                added.Add(declared.Key);
            }

            foreach (var declaredSub in declared.SubModules)
            {
                var subModule = module.SubModules.SingleOrDefault(s => s.Key == declaredSub.Key);
                if (subModule is null)
                {
                    subModule = new ErpSubModule
                    {
                        Key = declaredSub.Key,
                        NameEn = declaredSub.Name.En,
                        NameBn = declaredSub.Name.Bn,
                        Icon = declaredSub.Icon,
                        SortOrder = declaredSub.Order,
                    };
                    module.SubModules.Add(subModule);
                    added.Add($"{declared.Key}/{declaredSub.Key}");
                }

                foreach (var feature in declaredSub.Features)
                {
                    var code = $"{declared.Key}.{feature.Key}";
                    if (featureCodes.Contains(code)) continue;

                    subModule.Features.Add(new ErpFeature
                    {
                        Key = feature.Key,
                        Code = code,
                        NameEn = feature.Name.En,
                        NameBn = feature.Name.Bn,
                        SortOrder = feature.Order,
                    });
                    added.Add(code);
                }
            }
        }

        if (added.Count == 0) return;
        await db.SaveChangesAsync(cancellationToken);
        logger.LogInformation("ERP menu: added {Entries}", string.Join(", ", added));
    }
}

using Erp.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Erp.Infrastructure;

public static class DependencyInjection
{
    public const string ConnectionStringName = "Erp";

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString(ConnectionStringName);
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                $"Connection string '{ConnectionStringName}' is not configured. " +
                "Set ConnectionStrings:Erp in appsettings.Development.json or the ConnectionStrings__Erp environment variable.");
        }

        services.AddDbContext<ErpDbContext>(options => options.UseSqlServer(
            connectionString,
            sql => sql.MigrationsAssembly(typeof(ErpDbContext).Assembly.FullName)));

        services.AddHealthChecks()
            .AddDbContextCheck<ErpDbContext>("database", tags: ["db"]);

        return services;
    }
}

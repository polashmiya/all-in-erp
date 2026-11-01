using Erp.Core.Tenancy;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Erp.Infrastructure.Persistence;

/// <summary>
/// Used only by `dotnet ef` to build the model for migrations. The connection string is used by
/// `dotnet ef database update`; the app itself reads ConnectionStrings:Erp.
/// </summary>
public sealed class ErpDbContextDesignTimeFactory : IDesignTimeDbContextFactory<ErpDbContext>
{
    public ErpDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__Erp")
            ?? "Server=(localdb)\\MSSQLLocalDB;Database=myErp;Trusted_Connection=True;TrustServerCertificate=True";

        var options = new DbContextOptionsBuilder<ErpDbContext>().UseSqlServer(connectionString).Options;
        return new ErpDbContext(options, SystemCurrentContext.Instance);
    }
}

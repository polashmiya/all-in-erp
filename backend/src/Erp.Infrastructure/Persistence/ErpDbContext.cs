using Microsoft.EntityFrameworkCore;

namespace Erp.Infrastructure.Persistence;

/// <summary>
/// Single EF Core context for the ERP. Entity configurations are discovered from this assembly;
/// module and metadata assemblies are added to the model as they gain entities in later phases.
/// </summary>
public sealed class ErpDbContext(DbContextOptions<ErpDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ErpDbContext).Assembly);
    }
}

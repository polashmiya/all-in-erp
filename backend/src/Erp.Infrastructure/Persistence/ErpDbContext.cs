using System.Linq.Expressions;
using Erp.Core.Domain;
using Erp.Core.Domain.Identity;
using Erp.Core.Domain.Navigation;
using Erp.Core.Domain.Tenancy;
using Erp.Core.Tenancy;
using Microsoft.EntityFrameworkCore;

namespace Erp.Infrastructure.Persistence;

public static class QueryFilters
{
    /// <summary>Restricts account-owned data to the current account (and BU-owned data to the current unit).</summary>
    public const string Tenant = "Tenant";

    /// <summary>
    /// Lifts only the tenant filter, for code that legitimately works across tenants (Panel, login, seeding).
    /// Other filters added later (e.g. soft delete) still apply.
    /// </summary>
    public static IQueryable<T> AcrossTenants<T>(this IQueryable<T> query) where T : class =>
        query.IgnoreQueryFilters([Tenant]);
}

/// <summary>
/// Single EF Core context for the ERP. Tenant isolation is a global query filter driven by
/// <see cref="ICurrentContext"/>; with no tenant in context the filter matches nothing (fail closed).
/// </summary>
public class ErpDbContext : DbContext
{
    private readonly ICurrentContext _current;

    public ErpDbContext(DbContextOptions<ErpDbContext> options, ICurrentContext current)
        : base(options)
    {
        _current = current;
    }

    /// <summary>For derived contexts (tests) that add entity types to the model.</summary>
    protected ErpDbContext(DbContextOptions options, ICurrentContext current)
        : base(options)
    {
        _current = current;
    }

    public DbSet<Account> Accounts => Set<Account>();

    public DbSet<BusinessUnit> BusinessUnits => Set<BusinessUnit>();

    public DbSet<Office> Offices => Set<Office>();

    public DbSet<Warehouse> Warehouses => Set<Warehouse>();

    public DbSet<PanelMenuItem> PanelMenuItems => Set<PanelMenuItem>();

    public DbSet<PanelUser> PanelUsers => Set<PanelUser>();

    public DbSet<ErpUser> ErpUsers => Set<ErpUser>();

    public DbSet<UserBusinessUnit> UserBusinessUnits => Set<UserBusinessUnit>();

    public DbSet<Role> Roles => Set<Role>();

    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();

    public DbSet<Permission> Permissions => Set<Permission>();

    // Read by the query filters. EF parameterises these per context instance, so each request sees its own tenant.
    public Guid? CurrentAccountId => _current.AccountId;

    public Guid? CurrentBusinessUnitId => _current.BusinessUnitId;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ErpDbContext).Assembly);
        ConfigureBaseEntities(modelBuilder);
        ApplyTenantFilters(modelBuilder);
    }

    private static void ConfigureBaseEntities(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes()
                     .Where(t => t.BaseType is null && typeof(BaseEntity).IsAssignableFrom(t.ClrType)))
        {
            modelBuilder.Entity(entityType.ClrType).Property(nameof(BaseEntity.RowVersion)).IsRowVersion();
        }
    }

    private void ApplyTenantFilters(ModelBuilder modelBuilder)
    {
        var context = Expression.Constant(this);

        foreach (var entityType in modelBuilder.Model.GetEntityTypes()
                     .Where(t => t.BaseType is null && typeof(IAccountOwned).IsAssignableFrom(t.ClrType)))
        {
            var entity = Expression.Parameter(entityType.ClrType, "e");

            Expression filter = Matches(entity, nameof(IAccountOwned.AccountId), context, nameof(CurrentAccountId));
            if (typeof(IBusinessUnitOwned).IsAssignableFrom(entityType.ClrType))
            {
                filter = Expression.AndAlso(
                    filter,
                    Matches(entity, nameof(IBusinessUnitOwned.BusinessUnitId), context, nameof(CurrentBusinessUnitId)));
            }

            modelBuilder.Entity(entityType.ClrType).HasQueryFilter(QueryFilters.Tenant, Expression.Lambda(filter, entity));
        }
    }

    /// <summary>e.{property} == context.{contextProperty}, compared as Guid? so a missing tenant matches nothing.</summary>
    private static BinaryExpression Matches(ParameterExpression entity, string property, Expression context, string contextProperty) =>
        Expression.Equal(
            Expression.Convert(Expression.Property(entity, property), typeof(Guid?)),
            Expression.Property(context, contextProperty));
}

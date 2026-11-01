using Erp.Core.Authorization;
using Erp.Core.Tenancy;
using Erp.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Erp.Infrastructure.Authorization;

/// <summary>Resolves role permissions per (user, business unit); the current request's set is loaded once.</summary>
public sealed class PermissionService(ErpDbContext db, ICurrentContext current, PermissionCatalog catalog) : IPermissionService
{
    private PermissionSet? _current;

    public async Task<PermissionSet> GetCurrentAsync(CancellationToken cancellationToken = default)
    {
        if (_current is not null) return _current;
        if (current.UserId is not { } userId || current.BusinessUnitId is not { } businessUnitId) return PermissionSet.Empty;

        return _current = await GetAsync(userId, businessUnitId, current.IsPrimaryAdmin, cancellationToken);
    }

    public async Task<PermissionSet> GetAsync(
        Guid userId, Guid businessUnitId, bool isPrimaryAdmin, CancellationToken cancellationToken = default)
    {
        if (isPrimaryAdmin) return PermissionSet.All(catalog.Codes);

        var codes = await db.UserBusinessUnits
            .IgnoreQueryFilters()
            .Where(x => x.UserId == userId && x.BusinessUnitId == businessUnitId)
            .SelectMany(x => x.Role!.Permissions.Select(p => p.PermissionCode))
            .ToListAsync(cancellationToken);

        return PermissionSet.Of(codes);
    }
}

/// <summary>Checks that an ERP user may work in a business unit. Explicit account checks; no reliance on filters.</summary>
public sealed class BusinessUnitAccess(ErpDbContext db) : IBusinessUnitAccess
{
    public async Task<bool> CanAccessAsync(
        Guid userId, Guid accountId, Guid businessUnitId, bool isPrimaryAdmin, CancellationToken cancellationToken = default)
    {
        var userActive = await db.ErpUsers.IgnoreQueryFilters()
            .AnyAsync(u => u.Id == userId && u.AccountId == accountId && u.IsActive, cancellationToken);
        if (!userActive) return false;

        var unitActive = await db.BusinessUnits.IgnoreQueryFilters()
            .AnyAsync(b => b.Id == businessUnitId && b.AccountId == accountId && b.IsActive && b.Account!.IsActive, cancellationToken);
        if (!unitActive) return false;

        return isPrimaryAdmin || await db.UserBusinessUnits.IgnoreQueryFilters()
            .AnyAsync(x => x.UserId == userId && x.BusinessUnitId == businessUnitId && x.AccountId == accountId, cancellationToken);
    }
}

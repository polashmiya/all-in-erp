namespace Erp.Core.Authorization;

/// <summary>The permissions a user holds in one business unit.</summary>
public sealed class PermissionSet
{
    private readonly HashSet<string> _codes;

    private PermissionSet(IEnumerable<string> codes, bool grantsAll)
    {
        _codes = new HashSet<string>(codes, StringComparer.OrdinalIgnoreCase);
        GrantsAll = grantsAll;
    }

    public static PermissionSet Empty { get; } = new([], grantsAll: false);

    /// <summary>The account's primary admin: every permission, including ones added after login.</summary>
    public static PermissionSet All(IEnumerable<string> catalog) => new(catalog, grantsAll: true);

    public static PermissionSet Of(IEnumerable<string> codes) => new(codes, grantsAll: false);

    public bool GrantsAll { get; }

    /// <summary>Codes for the UI. For <see cref="GrantsAll"/> this is the full catalog known at creation.</summary>
    public IReadOnlyCollection<string> Codes => _codes;

    public bool Has(string code) => GrantsAll || _codes.Contains(code);
}

/// <summary>A permission a module exposes, e.g. inventory.item.export.</summary>
public sealed record PermissionDefinition(PermissionCode Code, string Description);

/// <summary>Modules register one of these to contribute permissions to the catalog.</summary>
public interface IPermissionProvider
{
    IEnumerable<PermissionDefinition> GetPermissions();
}

public interface IPermissionService
{
    /// <summary>Permissions of the current user in the current business unit (empty when no unit is selected).</summary>
    Task<PermissionSet> GetCurrentAsync(CancellationToken cancellationToken = default);

    Task<PermissionSet> GetAsync(Guid userId, Guid businessUnitId, bool isPrimaryAdmin, CancellationToken cancellationToken = default);
}

public interface IBusinessUnitAccess
{
    /// <summary>True when the ERP user may work in the business unit (assigned, or primary admin of its account; unit active).</summary>
    Task<bool> CanAccessAsync(Guid userId, Guid accountId, Guid businessUnitId, bool isPrimaryAdmin, CancellationToken cancellationToken = default);
}

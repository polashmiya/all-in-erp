using Erp.Core.Authorization;
using Erp.Core.Domain.Identity;

namespace Erp.Infrastructure.Tenancy;

/// <summary>The roles every account starts with.</summary>
public static class SystemRoles
{
    public const string Administrator = "Administrator";
    public const string Viewer = "Viewer";

    public static Role CreateAdministrator(Guid accountId, PermissionCatalog catalog) =>
        Create(accountId, Administrator, "Full access to every feature", catalog.Codes);

    public static Role CreateViewer(Guid accountId, PermissionCatalog catalog) =>
        Create(accountId, Viewer, "Read-only access with export", ViewerPermissions(catalog));

    public static IReadOnlyList<string> ViewerPermissions(PermissionCatalog catalog) =>
        catalog.All.Where(p => p.Code.Action is "view" or "export").Select(p => p.Code.Value).ToList();

    private static Role Create(Guid accountId, string name, string description, IEnumerable<string> permissions)
    {
        var role = new Role { AccountId = accountId, Name = name, Description = description, IsSystem = true };
        foreach (var code in permissions) role.Permissions.Add(new RolePermission { PermissionCode = code });
        return role;
    }
}

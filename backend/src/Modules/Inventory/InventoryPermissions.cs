using Erp.Core.Authorization;

namespace Erp.Modules.Inventory;

/// <summary>
/// Inventory permissions. Phase 2 derives these from the feature manifests' actions; until then they are
/// declared here so roles can be seeded and endpoints protected.
/// </summary>
public sealed class InventoryPermissions : IPermissionProvider
{
    public const string ItemView = "inventory.item.view";
    public const string ItemCreate = "inventory.item.create";
    public const string ItemEdit = "inventory.item.edit";
    public const string ItemDelete = "inventory.item.delete";
    public const string ItemExport = "inventory.item.export";
    public const string ItemImport = "inventory.item.import";

    public IEnumerable<PermissionDefinition> GetPermissions() =>
    [
        Define(ItemView, "View items"),
        Define(ItemCreate, "Create items"),
        Define(ItemEdit, "Edit items"),
        Define(ItemDelete, "Delete items"),
        Define(ItemExport, "Export items"),
        Define(ItemImport, "Import items"),
    ];

    private static PermissionDefinition Define(string code, string description) =>
        new(PermissionCode.Parse(code), description);
}

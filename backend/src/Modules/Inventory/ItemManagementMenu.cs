using Erp.Core.Modules;

namespace Erp.Modules.Inventory;

/// <summary>
/// Item master data. The Inventory code module owns these screens; in the ERP menu they sit under
/// System Setup → Item Management.
/// </summary>
public sealed class ItemManagementMenu : IErpMenuProvider
{
    public const string Module = "system-setup";

    public const string ItemProfile = "system-setup.item-profile";
    public const string ItemDepartment = "system-setup.item-department";
    public const string ItemCategory = "system-setup.item-category";
    public const string ItemSubCategory = "system-setup.item-sub-category";
    public const string ItemMinorCategory = "system-setup.item-minor-category";
    public const string Uom = "system-setup.uom";

    public static readonly string[] LookupReaders =
        [.. new[] { ItemProfile, ItemDepartment, ItemCategory, ItemSubCategory, ItemMinorCategory, Uom }.Select(f => $"{f}.{FeatureActions.View}")];

    public IEnumerable<MenuModule> GetModules() =>
    [
        new(Module, new("System Setup", "সিস্টেম সেটআপ"), "setting", 10,
        [
            new("item-management", new("Item Management", "আইটেম ব্যবস্থাপনা"), "appstore", 10,
            [
                new("item-profile", new("Item Profile", "আইটেম প্রোফাইল"), 10),
                new("item-department", new("Item Department", "আইটেম ডিপার্টমেন্ট"), 20),
                new("item-category", new("Item Category", "আইটেম ক্যাটাগরি"), 30),
                new("item-sub-category", new("Item Sub Category", "আইটেম সাব-ক্যাটাগরি"), 40),
                new("item-minor-category", new("Item Minor Category", "আইটেম মাইনর ক্যাটাগরি"), 50),
                new("uom", new("UOM", "পরিমাপের একক (UOM)"), 60),
            ]),
        ]),
    ];
}

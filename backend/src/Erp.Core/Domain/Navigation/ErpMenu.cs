namespace Erp.Core.Domain.Navigation;

/// <summary>Top level of the ERP menu, e.g. "System Setup".</summary>
public class ErpModule : BaseEntity
{
    /// <summary>Stable key, e.g. "system-setup" (first segment of feature codes and routes).</summary>
    public required string Key { get; set; }

    public required string NameEn { get; set; }

    public string? NameBn { get; set; }

    /// <summary>Icon name from the frontend icon registry.</summary>
    public string? Icon { get; set; }

    public int SortOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<ErpSubModule> SubModules { get; } = [];
}

/// <summary>Second level of the ERP menu, e.g. "Item Management".</summary>
public class ErpSubModule : BaseEntity
{
    public Guid ModuleId { get; set; }

    public ErpModule? Module { get; set; }

    /// <summary>Unique within its module, e.g. "item-management".</summary>
    public required string Key { get; set; }

    public required string NameEn { get; set; }

    public string? NameBn { get; set; }

    public string? Icon { get; set; }

    public int SortOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<ErpFeature> Features { get; } = [];
}

/// <summary>A screen, e.g. "Item Profile". Accounts are given features; permissions are per feature and action.</summary>
public class ErpFeature : BaseEntity
{
    public Guid SubModuleId { get; set; }

    public ErpSubModule? SubModule { get; set; }

    public required string Key { get; set; }

    /// <summary>
    /// <c>{module}.{feature}</c>, e.g. "system-setup.item-profile". Stable even if the feature is moved in the menu:
    /// it is the route (/app/system-setup/item-profile) and the prefix of its permission codes.
    /// </summary>
    public required string Code { get; set; }

    public required string NameEn { get; set; }

    public string? NameBn { get; set; }

    public int SortOrder { get; set; }

    public bool IsActive { get; set; } = true;
}

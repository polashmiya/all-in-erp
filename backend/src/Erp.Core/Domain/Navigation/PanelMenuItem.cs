namespace Erp.Core.Domain.Navigation;

/// <summary>
/// A Panel sidebar entry. The Panel menu is read from this table (any depth); rows without a path are groups.
/// </summary>
public class PanelMenuItem : BaseEntity
{
    /// <summary>Stable identifier, e.g. "accounts".</summary>
    public required string Key { get; set; }

    public Guid? ParentId { get; set; }

    public PanelMenuItem? Parent { get; set; }

    public ICollection<PanelMenuItem> Children { get; } = [];

    public required string LabelEn { get; set; }

    public string? LabelBn { get; set; }

    /// <summary>Icon name from the frontend icon registry, e.g. "bank".</summary>
    public string? Icon { get; set; }

    /// <summary>Route in the Panel app; null for groups.</summary>
    public string? Path { get; set; }

    public int SortOrder { get; set; }

    public bool IsActive { get; set; } = true;
}

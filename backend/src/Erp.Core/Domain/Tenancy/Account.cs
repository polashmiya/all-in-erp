namespace Erp.Core.Domain.Tenancy;

/// <summary>A client company. Everything a client owns hangs off its account.</summary>
public class Account : BaseEntity
{
    public required string Code { get; set; }

    public required string Name { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<BusinessUnit> BusinessUnits { get; } = [];
}

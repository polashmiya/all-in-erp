namespace Erp.Core.Domain.Tenancy;

/// <summary>An office or branch of a business unit.</summary>
public class Office : BaseEntity, IBusinessUnitOwned
{
    public Guid AccountId { get; set; }

    public Guid BusinessUnitId { get; set; }

    public BusinessUnit? BusinessUnit { get; set; }

    /// <summary>Unique within the business unit.</summary>
    public required string Code { get; set; }

    public required string Name { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<Warehouse> Warehouses { get; } = [];
}

/// <summary>A stock location. Belongs to a business unit, and optionally to one of its offices.</summary>
public class Warehouse : BaseEntity, IBusinessUnitOwned
{
    public Guid AccountId { get; set; }

    public Guid BusinessUnitId { get; set; }

    public BusinessUnit? BusinessUnit { get; set; }

    /// <summary>Null when the warehouse sits directly under the business unit.</summary>
    public Guid? OfficeId { get; set; }

    public Office? Office { get; set; }

    /// <summary>Unique within the business unit.</summary>
    public required string Code { get; set; }

    public required string Name { get; set; }

    public string? Address { get; set; }

    public bool IsActive { get; set; } = true;
}

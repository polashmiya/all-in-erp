namespace Erp.Core.Domain.Tenancy;

/// <summary>A depot, branch or plant of an account. Screen configuration is applied per business unit.</summary>
public class BusinessUnit : BaseEntity, IAccountOwned
{
    public Guid AccountId { get; set; }

    public Account? Account { get; set; }

    public required string Code { get; set; }

    public required string Name { get; set; }

    public bool IsActive { get; set; } = true;
}

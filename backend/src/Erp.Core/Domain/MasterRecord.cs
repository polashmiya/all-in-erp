namespace Erp.Core.Domain;

public interface IAuditedRecord
{
    DateTime? TransactionDate { get; set; }

    DateTime? CreatedAt { get; set; }

    Guid? CreatedById { get; set; }

    DateTime? ModifiedAt { get; set; }

    Guid? ModifiedById { get; set; }
}

public abstract class MasterRecord : IAuditedRecord, IAccountOwned
{
    public int Id { get; set; }

    public Guid AccountId { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime? TransactionDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public Guid? CreatedById { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public Guid? ModifiedById { get; set; }
}

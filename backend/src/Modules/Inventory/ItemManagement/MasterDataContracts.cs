using FluentValidation;

namespace Erp.Modules.Inventory.ItemManagement;

public sealed record StatusCounts(int All, int Active, int Inactive);

public sealed record RecordStatusRequest(IReadOnlyList<int> Ids, bool IsActive);

public sealed record RecordIdsRequest(IReadOnlyList<int> Ids);

public sealed record AffectedRecords(int Count);

public sealed record ItemLookup(int Id, string? Code, string Name, bool IsActive, int? ParentId);

internal sealed class RecordStatusRequestValidator : AbstractValidator<RecordStatusRequest>
{
    public RecordStatusRequestValidator()
    {
        RuleFor(x => x.Ids).NotEmpty().Must(ids => ids.Count <= MasterData.MaxBatch)
            .WithMessage($"Change at most {MasterData.MaxBatch} records at a time.");
        RuleForEach(x => x.Ids).GreaterThan(0);
    }
}

internal sealed class RecordIdsRequestValidator : AbstractValidator<RecordIdsRequest>
{
    public RecordIdsRequestValidator()
    {
        RuleFor(x => x.Ids).NotEmpty().Must(ids => ids.Count <= MasterData.MaxBatch)
            .WithMessage($"Delete at most {MasterData.MaxBatch} records at a time.");
        RuleForEach(x => x.Ids).GreaterThan(0);
    }
}

using FluentValidation;

namespace Erp.Modules.Inventory.ItemManagement.MinorCategories;

public sealed record ItemMinorCategoryRow(
    int Id,
    string Name,
    int? DepartmentId,
    string? DepartmentName,
    int CategoryId,
    string CategoryName,
    int SubCategoryId,
    string SubCategoryName,
    string? ImageSource,
    bool IsActive,
    DateTime? CreatedAt,
    DateTime? ModifiedAt);

public sealed record ItemMinorCategoryList(IReadOnlyList<ItemMinorCategoryRow> Items, int Total, StatusCounts Counts);

public sealed record SaveItemMinorCategoryRequest(int SubCategoryId, string Name, string? ImageSource, bool IsActive);

internal sealed class SaveItemMinorCategoryRequestValidator : AbstractValidator<SaveItemMinorCategoryRequest>
{
    public SaveItemMinorCategoryRequestValidator()
    {
        RuleFor(x => x.SubCategoryId).GreaterThan(0).WithMessage("Choose a sub category.");
        RuleFor(x => x.Name).RecordName(100);
        RuleFor(x => x.ImageSource).ImageSource();
    }
}

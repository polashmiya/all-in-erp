using Erp.Core.Modules;
using Erp.Modules.Inventory.ItemManagement.Categories;
using Erp.Modules.Inventory.ItemManagement.Departments;
using Erp.Modules.Inventory.ItemManagement.MinorCategories;
using Erp.Modules.Inventory.ItemManagement.SubCategories;
using Erp.Modules.Inventory.ItemManagement.Uoms;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Erp.Modules.Inventory.ItemManagement;

public sealed class ItemManagementEndpoints : IErpEndpoints
{
    public void Map(IEndpointRouteBuilder erp)
    {
        var group = erp.MapGroup("/item-management");

        ItemDepartmentEndpoints.Map(group);
        ItemCategoryEndpoints.Map(group);
        ItemSubCategoryEndpoints.Map(group);
        ItemMinorCategoryEndpoints.Map(group);
        UomEndpoints.Map(group);
    }
}

using Erp.Core.Modules;
using Microsoft.Extensions.DependencyInjection;

namespace Erp.Modules.Inventory;

public static class InventoryModule
{
    public static IServiceCollection AddInventoryModule(this IServiceCollection services)
    {
        services.AddSingleton<IErpMenuProvider, ItemManagementMenu>();
        return services;
    }
}

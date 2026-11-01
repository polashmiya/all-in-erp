using Microsoft.AspNetCore.Routing;

namespace Erp.Core.Modules;

/// <summary>
/// Implemented by feature modules to add endpoints under <c>/api/erp</c>. The group already enforces the ERP
/// audience and resolves the business unit; endpoints add <c>RequirePermission(...)</c> as needed.
/// </summary>
public interface IErpEndpoints
{
    void Map(IEndpointRouteBuilder erp);
}

/// <summary>Implemented by modules to add endpoints under <c>/api/panel</c> (Panel audience enforced by the group).</summary>
public interface IPanelEndpoints
{
    void Map(IEndpointRouteBuilder panel);
}

namespace Erp.Api.Endpoints;

/// <summary>
/// The two API surfaces. Each gets its own JWT audience and authorization policy in Phase 1;
/// feature endpoints are attached to these groups as they are built.
/// </summary>
public static class ApiRouteGroups
{
    public const string PanelPrefix = "/api/panel";
    public const string ErpPrefix = "/api/erp";

    public static RouteGroupBuilder MapPanelApi(this IEndpointRouteBuilder app) =>
        app.MapGroup(PanelPrefix).WithTags("Panel");

    public static RouteGroupBuilder MapErpApi(this IEndpointRouteBuilder app) =>
        app.MapGroup(ErpPrefix).WithTags("ERP");
}

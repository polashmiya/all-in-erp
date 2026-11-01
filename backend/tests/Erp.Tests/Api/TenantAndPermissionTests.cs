using System.Net;
using System.Net.Http.Json;
using Erp.Api.Hosting;
using Erp.Modules.Inventory;
using Erp.Tests.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace Erp.Tests.Api;

/// <summary>X-Business-Unit validation, RequirePermission and the tenant filter, end to end through HTTP.</summary>
[Collection(ApiCollection.Name)]
public sealed class TenantAndPermissionTests(ApiFactory factory)
{
    [Fact]
    public async Task Valid_business_unit_header_becomes_the_request_context()
    {
        var login = await factory.ErpAdminLoginAsync();

        var context = await factory.CreateClient(login.AccessToken, factory.ChattogramId)
            .GetFromJsonAsync<ProbeContext>("/api/erp/__probe/context");

        Assert.Equal(login.User.Id, context!.UserId);
        Assert.Equal(login.User.AccountId, context.AccountId);
        Assert.Equal(factory.ChattogramId, context.BusinessUnitId);
    }

    [Fact]
    public async Task Malformed_business_unit_header_is_400()
    {
        var login = await factory.ErpAdminLoginAsync();
        var client = factory.CreateClient(login.AccessToken);
        client.DefaultRequestHeaders.Add(BusinessUnitHeaderFilter.HeaderName, "not-a-guid");

        var response = await client.GetAsync("/api/erp/__probe/context");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Unassigned_business_unit_header_is_403()
    {
        var login = await factory.ErpLoginAsync(ApiFactory.ViewerEmail, ApiFactory.TestPassword);

        var response = await factory.CreateClient(login.AccessToken, factory.ChattogramId).GetAsync("/api/erp/__probe/context");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Primary_admin_cannot_use_another_accounts_unit()
    {
        var login = await factory.ErpAdminLoginAsync();

        var response = await factory.CreateClient(login.AccessToken, factory.OtherAccountUnitId).GetAsync("/api/erp/__probe/context");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Permission_protected_endpoint_requires_a_business_unit()
    {
        var login = await factory.ErpAdminLoginAsync();

        var response = await factory.CreateClient(login.AccessToken).GetAsync("/api/erp/__probe/view");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.Equal("Business unit required", problem!.Title);
    }

    [Fact]
    public async Task Primary_admin_passes_every_permission_check()
    {
        var login = await factory.ErpAdminLoginAsync();
        var client = factory.CreateClient(login.AccessToken, factory.DhakaId);

        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/api/erp/__probe/view")).StatusCode);
        Assert.Equal(HttpStatusCode.NoContent, (await client.PostAsync("/api/erp/__probe/create", null)).StatusCode);
    }

    [Fact]
    public async Task Viewer_role_can_view_but_not_create()
    {
        var login = await factory.ErpLoginAsync(ApiFactory.ViewerEmail, ApiFactory.TestPassword);
        var client = factory.CreateClient(login.AccessToken, factory.DhakaId);

        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/api/erp/__probe/view")).StatusCode);

        var create = await client.PostAsync("/api/erp/__probe/create", null);
        Assert.Equal(HttpStatusCode.Forbidden, create.StatusCode);
        var problem = await create.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.Equal($"{ItemManagementMenu.ItemProfile}.create", problem!.Extensions["permission"]?.ToString());
    }

    [Fact]
    public async Task Tenant_filter_limits_plain_queries_to_the_callers_account()
    {
        var demo = await factory.ErpAdminLoginAsync();
        var other = await factory.ErpLoginAsync(ApiFactory.OtherAdminEmail, ApiFactory.TestPassword);

        var demoUnits = await factory.CreateClient(demo.AccessToken).GetFromJsonAsync<string[]>("/api/erp/__probe/business-units");
        var otherUnits = await factory.CreateClient(other.AccessToken).GetFromJsonAsync<string[]>("/api/erp/__probe/business-units");

        Assert.Equal(["CTG", "DHK"], demoUnits!);
        Assert.Equal(["OTH"], otherUnits!);
    }
}

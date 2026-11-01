using System.Net;
using System.Net.Http.Json;
using Erp.Api.Auth;
using Erp.Api.Panel.Accounts;
using Erp.Api.Panel.Navigation;
using Erp.Core.Domain.Navigation;
using Erp.Infrastructure.Persistence.Seeding;
using Erp.Tests.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Erp.Tests.Api;

[Collection(ApiCollection.Name)]
public sealed class PanelAccountTests(ApiFactory factory)
{
    private async Task<HttpClient> PanelClientAsync()
    {
        var login = await factory.PanelLoginAsync(factory.Seed.PanelAdmin.Email, factory.Seed.PanelAdmin.Password);
        return factory.CreateClient(login.AccessToken);
    }

    private static string UniqueCode() => $"T{Guid.NewGuid():N}"[..12].ToUpperInvariant();

    private static AccountSetupRequest Request(string code, string adminEmail, string? password = null) => new(
        new AccountInfoInput(
            code.ToLowerInvariant(), "Test Trading Ltd", "info@test.example", "+8801711111111", "https://test.example",
            "Distribution", "BIN-001", "House 1, Road 2, Gulshan", "Dhaka", "bd", "bdt", "Asia/Dhaka"),
        [
            new BusinessUnitInput("north", "North Division", null, null, "Bogura",
                [new OfficeInput("ho", "Head Office", null, "+8801722222222", null), new OfficeInput("br1", "Branch One", null, null, null)],
                [new WarehouseInput("wh1", "Main Warehouse", "ho", null), new WarehouseInput("wh2", "Branch Store", "BR1", null), new WarehouseInput("tr", "Transit", null, null)]),
            new BusinessUnitInput("south", "South Division", "south@test.example", null, null,
                [],
                [new WarehouseInput("swh", "South Warehouse", null, "Khulna")]),
        ],
        new AdminUserInput("Test Admin", adminEmail, password));

    [Fact]
    public async Task Navigation_is_read_from_the_database()
    {
        var client = await PanelClientAsync();

        var menu = await client.GetFromJsonAsync<List<PanelMenuItemDto>>("/api/panel/navigation");

        var accounts = Assert.Single(menu!, m => m.Key == "accounts");
        Assert.Equal(("Accounts", "অ্যাকাউন্ট"), (accounts.Label.En, accounts.Label.Bn));
        Assert.Equal(("/accounts", "bank"), (accounts.Path, accounts.Icon));

        // Rows added to the table appear (nested), inactive rows do not.
        await using (var db = ApiFactory.CreateDbContext())
        {
            var group = new PanelMenuItem { Key = "test-group", LabelEn = "Test group", SortOrder = 99 };
            db.PanelMenuItems.AddRange(
                group,
                new PanelMenuItem { Key = "test-child", LabelEn = "Test child", Path = "/test/child", Parent = group },
                new PanelMenuItem { Key = "test-hidden", LabelEn = "Hidden", Path = "/hidden", IsActive = false });
            await db.SaveChangesAsync();
        }

        try
        {
            menu = await client.GetFromJsonAsync<List<PanelMenuItemDto>>("/api/panel/navigation");
            var added = Assert.Single(menu!, m => m.Key == "test-group");
            Assert.Equal("/test/child", Assert.Single(added.Children).Path);
            Assert.DoesNotContain(menu!, m => m.Key == "test-hidden");
        }
        finally
        {
            await using var db = ApiFactory.CreateDbContext();
            await db.PanelMenuItems.Where(m => m.Key.StartsWith("test-") && m.ParentId != null).ExecuteDeleteAsync();
            await db.PanelMenuItems.Where(m => m.Key.StartsWith("test-")).ExecuteDeleteAsync();
        }
    }

    [Fact]
    public async Task Erp_token_cannot_reach_panel_accounts()
    {
        var erp = await factory.ErpAdminLoginAsync();

        var response = await factory.CreateClient(erp.AccessToken).GetAsync("/api/panel/accounts");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Setup_creates_the_whole_tree_and_an_admin_who_can_sign_in_to_the_erp()
    {
        var client = await PanelClientAsync();
        var code = UniqueCode();
        var email = $"admin.{code.ToLowerInvariant()}@test.example";

        var response = await client.PostAsJsonAsync("/api/panel/accounts/setup", Request(code, email));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var result = (await response.Content.ReadFromJsonAsync<AccountSetupResult>())!;
        Assert.Equal((code, 2, 2, 4), (result.Code, result.BusinessUnits, result.Offices, result.Warehouses));
        Assert.Equal(email, result.Admin.Email);
        Assert.Equal(14, result.Admin.GeneratedPassword!.Length);

        // The stored tree: codes upper-cased, warehouses placed under the right office or the unit itself.
        var detail = (await client.GetFromJsonAsync<AccountDetail>($"/api/panel/accounts/{result.AccountId}"))!;
        Assert.Equal(("BD", "BDT", "Asia/Dhaka"), (detail.Country, detail.BaseCurrency, detail.TimeZone));
        Assert.Equal(email, detail.Admin!.Email);
        var north = Assert.Single(detail.BusinessUnits, b => b.Code == "NORTH");
        Assert.Equal(["BR1", "HO"], north.Offices.Select(o => o.Code));
        Assert.Equal("WH1", Assert.Single(north.Offices.Single(o => o.Code == "HO").Warehouses).Code);
        Assert.Equal("WH2", Assert.Single(north.Offices.Single(o => o.Code == "BR1").Warehouses).Code);
        Assert.Equal("TR", Assert.Single(north.Warehouses).Code);
        var south = Assert.Single(detail.BusinessUnits, b => b.Code == "SOUTH");
        Assert.Empty(south.Offices);
        Assert.Equal("SWH", Assert.Single(south.Warehouses).Code);

        // The generated admin signs in to the ERP as primary admin of both units with every permission.
        var erp = await factory.ErpLoginAsync(email, result.Admin.GeneratedPassword!);
        Assert.True(erp.User.IsPrimaryAdmin);
        Assert.Equal(["North Division", "South Division"], erp.BusinessUnits.Select(u => u.Name));
        Assert.All(erp.BusinessUnits, u => Assert.Equal("Administrator", u.RoleName));

        var selected = await factory.CreateClient(erp.AccessToken)
            .PostAsJsonAsync("/api/erp/auth/select-unit", new SelectUnitRequest(erp.BusinessUnits[0].Id));
        Assert.Equal(6, (await selected.Content.ReadFromJsonAsync<SelectUnitResponse>())!.Permissions.Count);
    }

    [Fact]
    public async Task Setup_with_a_chosen_password_does_not_return_one()
    {
        var client = await PanelClientAsync();
        var code = UniqueCode();
        var email = $"chosen.{code.ToLowerInvariant()}@test.example";

        var response = await client.PostAsJsonAsync("/api/panel/accounts/setup", Request(code, email, "Chosen@123"));

        response.EnsureSuccessStatusCode();
        Assert.Null((await response.Content.ReadFromJsonAsync<AccountSetupResult>())!.Admin.GeneratedPassword);
        Assert.Equal(email, (await factory.ErpLoginAsync(email, "Chosen@123")).User.Email);
    }

    [Fact]
    public async Task Validation_errors_point_at_the_exact_nested_field()
    {
        var client = await PanelClientAsync();
        var valid = Request(UniqueCode(), "nested@test.example");
        var north = valid.BusinessUnits[0];
        var invalid = valid with
        {
            Account = valid.Account with { Name = "", Email = "not-an-email" },
            BusinessUnits =
            [
                north with
                {
                    Offices = [north.Offices[0], north.Offices[0] with { Name = "Duplicate code" }],
                    Warehouses = [north.Warehouses[0] with { OfficeCode = "NOPE" }],
                },
                valid.BusinessUnits[1] with { Code = "NORTH" },
            ],
        };

        var response = await client.PostAsJsonAsync("/api/panel/accounts/setup", invalid);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var errors = (await response.Content.ReadFromJsonAsync<ValidationProblemDetails>())!.Errors;
        Assert.Contains("account.name", errors.Keys);
        Assert.Contains("account.email", errors.Keys);
        Assert.Contains("businessUnits[1].code", errors.Keys);
        Assert.Contains("businessUnits[0].offices[1].code", errors.Keys);
        Assert.Contains("businessUnits[0].warehouses[0].officeCode", errors.Keys);
    }

    [Fact]
    public async Task Taken_account_code_and_admin_email_are_reported_on_their_fields()
    {
        var client = await PanelClientAsync();

        var response = await client.PostAsJsonAsync(
            "/api/panel/accounts/setup", Request(DemoDataSeeder.AccountCode, factory.Seed.ErpAdmin.Email));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var errors = (await response.Content.ReadFromJsonAsync<ValidationProblemDetails>())!.Errors;
        Assert.Equal(["account.code", "admin.email"], errors.Keys.Order());
    }

    [Fact]
    public async Task Availability_reports_taken_and_free_values()
    {
        var client = await PanelClientAsync();

        var taken = await client.GetFromJsonAsync<AvailabilityResponse>(
            $"/api/panel/accounts/availability?accountCode=demo-pharma&adminEmail={factory.Seed.ErpAdmin.Email.ToUpperInvariant()}");
        var free = await client.GetFromJsonAsync<AvailabilityResponse>(
            $"/api/panel/accounts/availability?accountCode={UniqueCode()}&adminEmail=new.person@test.example");

        Assert.Equal((false, false), (taken!.AccountCodeAvailable, taken.AdminEmailAvailable));
        Assert.Equal((true, true), (free!.AccountCodeAvailable, free.AdminEmailAvailable));
    }

    [Fact]
    public async Task List_searches_pages_and_reports_structure_counts()
    {
        var client = await PanelClientAsync();
        var code = UniqueCode();
        (await client.PostAsJsonAsync("/api/panel/accounts/setup", Request(code, $"list.{code.ToLowerInvariant()}@test.example")))
            .EnsureSuccessStatusCode();

        var found = await client.GetFromJsonAsync<AccountListResponse>($"/api/panel/accounts?search={code}");
        var item = Assert.Single(found!.Items);
        Assert.Equal((2, 2, 4, 1), (item.BusinessUnits, item.Offices, item.Warehouses, item.Users));
        Assert.StartsWith("list.", item.AdminEmail);

        var demo = (await client.GetFromJsonAsync<AccountListResponse>("/api/panel/accounts?search=DEMO-PHARMA"))!.Items.Single();
        Assert.Equal((2, 3, 5), (demo.BusinessUnits, demo.Offices, demo.Warehouses));

        var firstPage = await client.GetFromJsonAsync<AccountListResponse>("/api/panel/accounts?pageSize=1&sort=code");
        Assert.Single(firstPage!.Items);
        Assert.True(firstPage.Total >= 3);
        Assert.Equal(firstPage.Total, firstPage.Summary.Accounts);
        Assert.True(firstPage.Summary.Warehouses >= 9);

        var inactive = await client.GetFromJsonAsync<AccountListResponse>($"/api/panel/accounts?search={code}&status=inactive");
        Assert.Empty(inactive!.Items);
    }

    [Fact]
    public async Task Unknown_account_is_404()
    {
        var client = await PanelClientAsync();

        var response = await client.GetAsync($"/api/panel/accounts/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}

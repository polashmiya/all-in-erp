using Erp.Core.Authorization;

namespace Erp.Tests.Unit;

public sealed class PermissionCodeTests
{
    [Theory]
    [InlineData("inventory.item.create")]
    [InlineData("inventory.item-category.view")]
    [InlineData("sales.sales-order2.approve")]
    public void Accepts_module_feature_action(string value)
    {
        Assert.True(PermissionCode.TryParse(value, out var code));
        Assert.Equal(value, code.Value);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("inventory.item")]
    [InlineData("inventory.item.create.extra")]
    [InlineData("Inventory.Item.Create")]
    [InlineData("inventory..create")]
    [InlineData("inventory.item.1create")]
    [InlineData("inventory.item.create ")]
    public void Rejects_anything_else(string? value)
    {
        Assert.False(PermissionCode.IsValid(value));
        Assert.False(PermissionCode.TryParse(value, out _));
    }

    [Fact]
    public void Parse_splits_the_segments()
    {
        var code = PermissionCode.Parse("inventory.item.export");

        Assert.Equal(("inventory", "item", "export"), (code.Module, code.Feature, code.Action));
    }
}

public sealed class PermissionSetTests
{
    [Fact]
    public void Role_permissions_grant_exactly_their_codes()
    {
        var set = PermissionSet.Of(["inventory.item.view", "inventory.item.export"]);

        Assert.True(set.Has("inventory.item.view"));
        Assert.False(set.Has("inventory.item.create"));
        Assert.False(set.GrantsAll);
    }

    [Fact]
    public void Codes_are_compared_case_insensitively()
    {
        Assert.True(PermissionSet.Of(["inventory.item.view"]).Has("Inventory.Item.View"));
    }

    [Fact]
    public void Primary_admin_set_grants_codes_outside_the_snapshot()
    {
        var set = PermissionSet.All(["inventory.item.view"]);

        Assert.True(set.Has("inventory.item.view"));
        Assert.True(set.Has("sales.order.approve"));
        Assert.Equal(["inventory.item.view"], set.Codes);
    }

    [Fact]
    public void Empty_set_grants_nothing()
    {
        Assert.False(PermissionSet.Empty.Has("inventory.item.view"));
    }
}

public sealed class PermissionCatalogTests
{
    private sealed class Provider(params string[] codes) : IPermissionProvider
    {
        public IEnumerable<PermissionDefinition> GetPermissions() =>
            codes.Select(c => new PermissionDefinition(PermissionCode.Parse(c), c));
    }

    [Fact]
    public void Merges_providers_in_code_order()
    {
        var catalog = new PermissionCatalog([new Provider("sales.order.view"), new Provider("inventory.item.view")]);

        Assert.Equal(["inventory.item.view", "sales.order.view"], catalog.Codes);
    }

    [Fact]
    public void Rejects_duplicate_codes_across_modules()
    {
        var error = Assert.Throws<InvalidOperationException>(() =>
            new PermissionCatalog([new Provider("inventory.item.view"), new Provider("inventory.item.view")]));

        Assert.Contains("inventory.item.view", error.Message);
    }
}

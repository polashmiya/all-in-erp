namespace Erp.Core.Authorization;

/// <summary>All permissions contributed by the registered modules.</summary>
public sealed class PermissionCatalog
{
    public PermissionCatalog(IEnumerable<IPermissionProvider> providers)
    {
        var definitions = providers.SelectMany(p => p.GetPermissions()).ToList();

        var duplicate = definitions.GroupBy(d => d.Code.Value).FirstOrDefault(g => g.Count() > 1);
        if (duplicate is not null)
        {
            throw new InvalidOperationException($"Permission '{duplicate.Key}' is declared more than once.");
        }

        All = definitions.OrderBy(d => d.Code.Value, StringComparer.Ordinal).ToList();
        Codes = All.Select(d => d.Code.Value).ToList();
    }

    public IReadOnlyList<PermissionDefinition> All { get; }

    public IReadOnlyList<string> Codes { get; }
}

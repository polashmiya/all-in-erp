using System.Diagnostics.CodeAnalysis;
using System.Text.RegularExpressions;

namespace Erp.Core.Authorization;

/// <summary>A permission code in the form <c>{module}.{feature}.{action}</c>, e.g. <c>inventory.item.create</c>.</summary>
public readonly partial record struct PermissionCode(string Module, string Feature, string Action)
{
    public string Value => $"{Module}.{Feature}.{Action}";

    public override string ToString() => Value;

    public static PermissionCode Parse(string value) =>
        TryParse(value, out var code) ? code : throw new FormatException($"'{value}' is not a valid permission code ({{module}}.{{feature}}.{{action}}).");

    public static bool TryParse([NotNullWhen(true)] string? value, out PermissionCode code)
    {
        code = default;
        if (value is null || !Pattern().IsMatch(value)) return false;

        var parts = value.Split('.');
        code = new PermissionCode(parts[0], parts[1], parts[2]);
        return true;
    }

    public static bool IsValid([NotNullWhen(true)] string? value) => value is not null && Pattern().IsMatch(value);

    /// <summary>Three lower-case segments; each starts with a letter and may contain digits and dashes.</summary>
    [GeneratedRegex("^[a-z][a-z0-9-]*\\.[a-z][a-z0-9-]*\\.[a-z][a-z0-9-]*$")]
    private static partial Regex Pattern();
}

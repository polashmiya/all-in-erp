using Erp.Core.Tenancy;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Erp.Core.Authorization;

/// <summary>Endpoint metadata describing the permission an endpoint needs (also useful for docs and tests).</summary>
public sealed record RequiredPermission(string Code);

public sealed record RequiredAnyPermission(IReadOnlyList<string> Codes);

public static class PermissionEndpointExtensions
{
    /// <summary>
    /// Requires a business unit (X-Business-Unit) and the given permission in it. The UI hides what a user
    /// cannot do, but this check is the actual protection.
    /// </summary>
    public static TBuilder RequirePermission<TBuilder>(this TBuilder builder, string code)
        where TBuilder : IEndpointConventionBuilder
    {
        EnsureValid(code);
        builder.WithMetadata(new RequiredPermission(code));
        return builder.AddPermissionFilter([code]);
    }

    public static TBuilder RequireAnyPermission<TBuilder>(this TBuilder builder, params string[] codes)
        where TBuilder : IEndpointConventionBuilder
    {
        if (codes.Length == 0) throw new ArgumentException("At least one permission code is required.", nameof(codes));
        foreach (var code in codes) EnsureValid(code);

        builder.WithMetadata(new RequiredAnyPermission(codes));
        return builder.AddPermissionFilter(codes);
    }

    private static void EnsureValid(string code)
    {
        if (!PermissionCode.IsValid(code))
        {
            throw new ArgumentException($"'{code}' is not a valid permission code ({{module}}.{{feature}}.{{action}}).", nameof(code));
        }
    }

    private static TBuilder AddPermissionFilter<TBuilder>(this TBuilder builder, IReadOnlyList<string> codes)
        where TBuilder : IEndpointConventionBuilder
    {
        builder.AddEndpointFilter(async (context, next) =>
        {
            var services = context.HttpContext.RequestServices;
            var current = services.GetRequiredService<ICurrentContext>();

            if (!current.IsAuthenticated) return TypedResults.Unauthorized();

            if (current.BusinessUnitId is null)
            {
                return TypedResults.Problem(
                    title: "Business unit required",
                    detail: "Send the X-Business-Unit header with a business unit you have access to.",
                    statusCode: StatusCodes.Status400BadRequest);
            }

            var permissions = await services.GetRequiredService<IPermissionService>()
                .GetCurrentAsync(context.HttpContext.RequestAborted);

            if (!codes.Any(permissions.Has))
            {
                var required = codes.Count == 1 ? $"the '{codes[0]}' permission" : $"one of {string.Join(", ", codes.Select(c => $"'{c}'"))}";
                return TypedResults.Problem(
                    title: "Permission denied",
                    detail: $"You need {required} in this business unit.",
                    statusCode: StatusCodes.Status403Forbidden,
                    extensions: new Dictionary<string, object?> { ["permission"] = codes.Count == 1 ? codes[0] : codes });
            }

            return await next(context);
        });

        return builder;
    }
}

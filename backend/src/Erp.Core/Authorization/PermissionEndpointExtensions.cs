using Erp.Core.Tenancy;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Erp.Core.Authorization;

/// <summary>Endpoint metadata describing the permission an endpoint needs (also useful for docs and tests).</summary>
public sealed record RequiredPermission(string Code);

public static class PermissionEndpointExtensions
{
    /// <summary>
    /// Requires a business unit (X-Business-Unit) and the given permission in it. The UI hides what a user
    /// cannot do, but this check is the actual protection.
    /// </summary>
    public static TBuilder RequirePermission<TBuilder>(this TBuilder builder, string code)
        where TBuilder : IEndpointConventionBuilder
    {
        if (!PermissionCode.IsValid(code))
        {
            throw new ArgumentException($"'{code}' is not a valid permission code ({{module}}.{{feature}}.{{action}}).", nameof(code));
        }

        builder.WithMetadata(new RequiredPermission(code));
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

            if (!permissions.Has(code))
            {
                return TypedResults.Problem(
                    title: "Permission denied",
                    detail: $"You need the '{code}' permission in this business unit.",
                    statusCode: StatusCodes.Status403Forbidden,
                    extensions: new Dictionary<string, object?> { ["permission"] = code });
            }

            return await next(context);
        });

        return builder;
    }
}

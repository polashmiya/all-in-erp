using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Erp.Api.Endpoints;

public sealed record HealthCheckEntry(string Name, string Status, double DurationMs, string? Error);

public sealed record HealthResponse(string Status, double TotalDurationMs, IReadOnlyList<HealthCheckEntry> Checks);

public static class HealthEndpoints
{
    public static IEndpointRouteBuilder MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/health", GetHealth)
            .WithName("GetHealth")
            .WithTags("System")
            .WithSummary("Liveness + database connectivity")
            .Produces<HealthResponse>(StatusCodes.Status503ServiceUnavailable)
            .AllowAnonymous();

        return app;
    }

    private static async Task<Results<Ok<HealthResponse>, JsonHttpResult<HealthResponse>>> GetHealth(
        HealthCheckService healthChecks, CancellationToken cancellationToken)
    {
        var report = await healthChecks.CheckHealthAsync(cancellationToken);

        var response = new HealthResponse(
            report.Status.ToString(),
            Math.Round(report.TotalDuration.TotalMilliseconds, 1),
            report.Entries
                .Select(e => new HealthCheckEntry(
                    e.Key,
                    e.Value.Status.ToString(),
                    Math.Round(e.Value.Duration.TotalMilliseconds, 1),
                    e.Value.Exception?.Message ?? e.Value.Description))
                .ToList());

        return report.Status == HealthStatus.Healthy
            ? TypedResults.Ok(response)
            : TypedResults.Json(response, statusCode: StatusCodes.Status503ServiceUnavailable);
    }
}

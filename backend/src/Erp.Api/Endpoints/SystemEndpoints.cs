using System.Reflection;

namespace Erp.Api.Endpoints;

public sealed record ApiInfo(string Name, string Version, string Environment, DateTimeOffset ServerTime);

public static class SystemEndpoints
{
    private static readonly string Version =
        typeof(SystemEndpoints).Assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion
            .Split('+')[0]
        ?? "0.0.0";

    public static IEndpointRouteBuilder MapSystemEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/info", (IHostEnvironment env) =>
                TypedResults.Ok(new ApiInfo("myErp API", Version, env.EnvironmentName, DateTimeOffset.UtcNow)))
            .WithName("GetApiInfo")
            .WithTags("System")
            .WithSummary("API name, version and environment")
            .AllowAnonymous();

        return app;
    }
}

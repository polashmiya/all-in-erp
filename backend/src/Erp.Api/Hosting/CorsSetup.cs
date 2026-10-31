namespace Erp.Api.Hosting;

public static class CorsSetup
{
    public const string PolicyName = "frontends";

    /// <summary>Allows the Panel and ERP dev frontends (configured under Cors:AllowedOrigins).</summary>
    public static IServiceCollection AddFrontendCors(this IServiceCollection services, IConfiguration configuration)
    {
        var origins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

        services.AddCors(options => options.AddPolicy(PolicyName, policy => policy
            .WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithExposedHeaders("Content-Disposition")));

        return services;
    }
}

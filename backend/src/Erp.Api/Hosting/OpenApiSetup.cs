using System.Text.Json.Serialization;

namespace Erp.Api.Hosting;

public static class OpenApiSetup
{
    public static IServiceCollection AddErpOpenApi(this IServiceCollection services)
    {
        // Web defaults accept numbers-as-strings, which makes the OpenAPI schema emit `number | string`
        // for every numeric field. Strict keeps the generated TypeScript types honest.
        services.ConfigureHttpJsonOptions(options =>
            options.SerializerOptions.NumberHandling = JsonNumberHandling.Strict);

        services.AddOpenApi(options => options.AddDocumentTransformer((document, _, _) =>
        {
            document.Info.Title = "myErp API";
            document.Info.Version = "v1";
            document.Info.Description =
                "Configurable ERP API. `/api/panel/*` serves the internal configuration Panel, " +
                "`/api/erp/*` serves the client ERP app.";
            return Task.CompletedTask;
        }));

        return services;
    }
}

using System.Text.Json.Serialization;
using Microsoft.OpenApi;

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
                "`/api/erp/*` serves the client ERP app. Authenticate with the bearer token from the matching " +
                "`/auth/login`; ERP calls that work on business-unit data also send `X-Business-Unit: {id}`.";

            document.Components ??= new OpenApiComponents();
            document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();
            document.Components.SecuritySchemes["Bearer"] = new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "Token from /api/panel/auth/login or /api/erp/auth/login.",
            };
            document.Security = [new OpenApiSecurityRequirement { [new OpenApiSecuritySchemeReference("Bearer", document)] = [] }];

            return Task.CompletedTask;
        }));

        return services;
    }
}

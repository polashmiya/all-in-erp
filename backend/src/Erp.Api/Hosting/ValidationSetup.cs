using System.Text.Json;
using FluentValidation;

namespace Erp.Api.Hosting;

public static class ValidationSetup
{
    public static IServiceCollection AddRequestValidation(this IServiceCollection services)
    {
        // Error keys match the JSON (camelCase) property names the frontend sends.
        ValidatorOptions.Global.PropertyNameResolver = (_, member, _) =>
            member is null ? null : JsonNamingPolicy.CamelCase.ConvertName(member.Name);

        services.AddValidatorsFromAssemblyContaining<Program>(includeInternalTypes: true);
        return services;
    }
}

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

    /// <summary>Validates the <typeparamref name="T"/> argument with its FluentValidation validator; 400 on failure.</summary>
    public static RouteHandlerBuilder Validate<T>(this RouteHandlerBuilder builder) where T : class =>
        builder.AddEndpointFilter<ValidationFilter<T>>().ProducesValidationProblem();
}

public sealed class ValidationFilter<T>(IValidator<T> validator) : IEndpointFilter where T : class
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        if (context.Arguments.OfType<T>().FirstOrDefault() is not { } argument)
        {
            return TypedResults.Problem(title: "Request body is required", statusCode: StatusCodes.Status400BadRequest);
        }

        var result = await validator.ValidateAsync(argument, context.HttpContext.RequestAborted);
        return result.IsValid ? await next(context) : TypedResults.ValidationProblem(result.ToDictionary());
    }
}

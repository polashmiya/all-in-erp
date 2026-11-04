using System.Security.Claims;
using Erp.Api.Hosting;
using Erp.Core.Domain.Identity;
using Erp.Core.Security;
using Erp.Core.Tenancy;
using Erp.Core.Validation;
using Erp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Erp.Api.Auth;

public static class PanelAuthEndpoints
{
    public static IEndpointRouteBuilder MapPanelAuthEndpoints(this IEndpointRouteBuilder panel)
    {
        var auth = panel.MapGroup("/auth").WithTags("PanelAuth");

        auth.MapPost("/login", Login)
            .WithName("PanelLogin")
            .WithSummary("Sign in to the Panel")
            .AllowAnonymous()
            .RequireRateLimiting(RateLimitSetup.LoginPolicy)
            .Validate<LoginRequest>()
            .ProducesProblem(StatusCodes.Status401Unauthorized);

        auth.MapGet("/me", Me)
            .WithName("GetPanelSession")
            .WithSummary("The signed-in Panel user")
            .ProducesProblem(StatusCodes.Status401Unauthorized);

        return panel;
    }

    private static async Task<Results<Ok<PanelLoginResponse>, ProblemHttpResult>> Login(
        LoginRequest request,
        ErpDbContext db,
        IPasswordHasher hasher,
        TokenService tokens,
        TimeProvider clock,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await db.PanelUsers.SingleOrDefaultAsync(u => u.Email == email, cancellationToken);

        if (user is null)
        {
            hasher.SimulateVerify();
            return AuthProblems.InvalidCredentials();
        }

        if (!hasher.Verify(request.Password, user.PasswordHash) || !user.IsActive) return AuthProblems.InvalidCredentials();

        user.LastLoginAt = clock.GetUtcNow();
        await db.SaveChangesAsync(cancellationToken);

        var token = tokens.Issue(AuthSurfaces.Panel,
        [
            new Claim(ErpClaimTypes.Subject, user.Id.ToString()),
            new Claim(ErpClaimTypes.Email, user.Email),
            new Claim(ErpClaimTypes.Name, user.FullName),
            new Claim(ErpClaimTypes.Role, user.Role.ToString()),
        ]);

        return TypedResults.Ok(new PanelLoginResponse(token.AccessToken, token.ExpiresAt, ToDto(user)));
    }

    private static async Task<Results<Ok<PanelUserDto>, UnauthorizedHttpResult>> Me(
        ICurrentContext current, ErpDbContext db, CancellationToken cancellationToken)
    {
        var user = await db.PanelUsers.SingleOrDefaultAsync(u => u.Id == current.UserId && u.IsActive, cancellationToken);
        return user is null ? TypedResults.Unauthorized() : TypedResults.Ok(ToDto(user));
    }

    private static PanelUserDto ToDto(PanelUser user) => new(user.Id, user.Email, user.FullName, user.Role.ToString());
}

internal static class AuthProblems
{
    /// <summary>Same response for unknown email, wrong password and disabled user, so accounts cannot be enumerated.</summary>
    public static ProblemHttpResult InvalidCredentials() =>
        TypedResults.Problem(title: "Invalid email or password", statusCode: StatusCodes.Status401Unauthorized);
}

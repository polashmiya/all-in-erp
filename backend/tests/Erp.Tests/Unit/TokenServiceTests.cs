using System.Security.Claims;
using Erp.Api.Auth;
using Erp.Core.Security;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Time.Testing;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Erp.Tests.Unit;

public sealed class TokenServiceTests
{
    private static readonly JwtOptions Options = new()
    {
        Issuer = "myErp",
        SigningKey = "unit-test-signing-key-that-is-long-enough-for-hs256",
        AccessTokenLifetime = TimeSpan.FromHours(1),
    };

    private static TokenValidationParameters ParametersFor(string audience) => new()
    {
        ValidIssuer = Options.Issuer,
        ValidAudience = audience,
        IssuerSigningKey = Options.CreateSigningKey(),
        ValidateLifetime = false,
    };

    [Fact]
    public async Task Issued_token_carries_claims_and_validates_for_its_own_audience()
    {
        var clock = new FakeTimeProvider(new DateTimeOffset(2026, 11, 1, 10, 0, 0, TimeSpan.Zero));
        var issued = new TokenService(Microsoft.Extensions.Options.Options.Create(Options), clock)
            .Issue(AuthSurfaces.Erp, [new Claim(ErpClaimTypes.Subject, "u-1"), new Claim(ErpClaimTypes.AccountId, "a-1")]);

        Assert.Equal(clock.GetUtcNow().AddHours(1), issued.ExpiresAt);

        var result = await new JsonWebTokenHandler().ValidateTokenAsync(issued.AccessToken, ParametersFor(AuthSurfaces.Erp));
        Assert.True(result.IsValid);
        Assert.Equal("u-1", result.Claims[ErpClaimTypes.Subject]);
        Assert.Equal("a-1", result.Claims[ErpClaimTypes.AccountId]);
    }

    [Fact]
    public async Task Token_for_one_surface_is_invalid_for_the_other()
    {
        var issued = new TokenService(Microsoft.Extensions.Options.Options.Create(Options), TimeProvider.System)
            .Issue(AuthSurfaces.Panel, [new Claim(ErpClaimTypes.Subject, "u-1")]);

        var result = await new JsonWebTokenHandler().ValidateTokenAsync(issued.AccessToken, ParametersFor(AuthSurfaces.Erp));

        Assert.False(result.IsValid);
        Assert.IsType<SecurityTokenInvalidAudienceException>(result.Exception);
    }
}

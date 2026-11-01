using System.Security.Claims;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Erp.Api.Auth;

public sealed record IssuedToken(string AccessToken, DateTimeOffset ExpiresAt);

public sealed class TokenService(IOptions<JwtOptions> options, TimeProvider clock)
{
    private readonly JsonWebTokenHandler _handler = new();

    public IssuedToken Issue(string audience, IEnumerable<Claim> claims)
    {
        var jwt = options.Value;
        var now = clock.GetUtcNow();
        var expiresAt = now.Add(jwt.AccessTokenLifetime);

        var token = _handler.CreateToken(new SecurityTokenDescriptor
        {
            Issuer = jwt.Issuer,
            Audience = audience,
            Subject = new ClaimsIdentity(claims.Append(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N")))),
            IssuedAt = now.UtcDateTime,
            NotBefore = now.UtcDateTime,
            Expires = expiresAt.UtcDateTime,
            SigningCredentials = new SigningCredentials(jwt.CreateSigningKey(), SecurityAlgorithms.HmacSha256),
        });

        return new IssuedToken(token, expiresAt);
    }
}

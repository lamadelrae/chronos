using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Chronos.Api.ApiConcerns;

public static class JwtOptionsProvider
{
    public static Action<JwtBearerOptions> GetProvider(IConfiguration configuration) => (options) =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = GetTokenValidationParameters(configuration);
    };

    private static TokenValidationParameters GetTokenValidationParameters(IConfiguration configuration)
    {
        var privateKey = configuration.GetValue<string>("Auth:PrivateKey")!;

        return new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(privateKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true
        };
    }
}
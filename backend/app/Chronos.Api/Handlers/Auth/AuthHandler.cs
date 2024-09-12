using Chronos.Api.Data;
using Chronos.Api.Shared.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Chronos.Api.Handlers.Auth;

public interface IAuthHandler
{
    Task<string> Handle(LoginRequest request);

    public record LoginRequest(string Email, string Password);
}

public class AuthHandler(Context context, IConfiguration configuration) : IAuthHandler
{
    public async Task<string> Handle(IAuthHandler.LoginRequest request)
    {
        var user = await context.Set<Entities.User>().FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || user.Password != request.Password.ToSha256())
            throw new UnauthorizedAccessException("Invalid email or password.");

        var token = GenerateJwtToken(user);
        return token;
    }

    private string GenerateJwtToken(Entities.User user)
    {
        var handler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(configuration.GetValue<string>("Auth:PrivateKey")!);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
                [
                    new Claim("companyId", user.CompanyId.ToString()),
                    new Claim("id", user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name)
                ]),
            Expires = DateTime.UtcNow.AddHours(6),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }
}
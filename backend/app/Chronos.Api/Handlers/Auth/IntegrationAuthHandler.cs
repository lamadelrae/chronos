using System.Security.Claims;
using System.Text.Encodings.Web;
using Chronos.Api.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace Chronos.Api.Handlers.Auth;

public class IntegrationAuthHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder,
    Context context) : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    private const string TokenHeaderName = "Authorization";

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue(TokenHeaderName, out var token))
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid Token"));
        }

        if (!Guid.TryParse(token, out var parsedToken))
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid Token"));
        }

        var companyExists = context.Set<Entities.Company>().Any(c => c.Id == parsedToken);

        if (!companyExists)
        {
            return Task.FromResult(AuthenticateResult.Fail("Company not found"));
        }

        var identity = new ClaimsIdentity(
            [
                new Claim(ClaimTypes.Role, "integrator")
            ],
            nameof(IntegrationAuthHandler));

        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
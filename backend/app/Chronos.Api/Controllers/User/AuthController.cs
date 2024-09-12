using Chronos.Api.Handlers.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers.User;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthHandler authHandler) : ControllerBase
{

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] IAuthHandler.LoginRequest request)
    {
        try
        {
            var token = await authHandler.Handle(request);
            return Ok(new { Token = token });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
    }
}
using Chronos.Api.Handlers.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers.User;

[ApiController]
[Route("api/user")]
public class UserController(
    ISaveUserHandler saveUserHandler,
    IFetchCurrentUserHandler fetchCurrentUserHandler,
    IUpdateUserHandler updateUserHandler) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Save([FromBody] ISaveUserHandler.Request request)
    {
        await saveUserHandler.Handle(request);
        return Created();
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> FetchCurrent()
    {
        var response = await fetchCurrentUserHandler.Handle();
        return Ok(response);
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateUser([FromBody] IUpdateUserHandler.Request request)
    {
        await updateUserHandler.Handle(request);
        return Ok();
    }
}

using Chronos.Api.Handlers.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers;

[ApiController]
[Route("api/user")]
public class UserController(
    ISaveUserHandler saveUserHandler,
    IDeleteUserHandler deleteUserHandler,
    IFetchUserHandler fetchUserHandler,
    IUpdateUserHandler updateUserHandler) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Save([FromBody] ISaveUserHandler.Request request)
    {
        await saveUserHandler.Handle(request);
        return Created();
    }

    [Authorize]
    [HttpDelete("{userId}")]
    public async Task<IActionResult> DeleteUser([FromRoute] Guid userId)
    {
        var request = new IDeleteUserHandler.Request(userId);
        await deleteUserHandler.Handle(request);
        return Ok();
    }

    [Authorize]
    [HttpGet("{userId}")]
    public async Task<IActionResult> FetchUser([FromRoute] Guid userId)
    {
        var request = new IFetchUserHandler.Request(userId);
        var response = await fetchUserHandler.Handle(request);
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

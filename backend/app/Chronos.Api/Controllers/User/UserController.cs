using Chronos.Api.Handlers.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers.User;

[ApiController]
[Route("api/user/user")]
public class UserController(
    ISaveUserHandler saveUserHandler,
    IDeleteUserHandler deleteUserHandler,
    IFetchUsersHandler fetchUsersHandler,
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
    public async Task<IActionResult> Delete([FromRoute] Guid userId)
    {
        var request = new IDeleteUserHandler.Request(userId);
        await deleteUserHandler.Handle(request);
        return Ok();
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> FetchUser([FromQuery] int page, [FromQuery] int size, [FromQuery] Guid? id)
    {
        var request = new IFetchUsersHandler.Request(page, size, id);
        var response = await fetchUsersHandler.Handle(request);
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

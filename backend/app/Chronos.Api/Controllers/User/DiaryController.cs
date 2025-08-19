using Chronos.Api.Handlers.Diary;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers.User;

[ApiController]
[Authorize]
[Route("api/diary")]
public class DiaryController(
    ISaveDiaryEntryHandler saveDiaryEntryHandler,
    IFetchDiaryEntriesHandler fetchDiaryEntriesHandler,
    IUpdateDiaryEntryHandler updateDiaryEntryHandler,
    IDeleteDiaryEntryHandler deleteDiaryEntryHandler) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Save([FromBody] ISaveDiaryEntryHandler.Request request)
    {
        await saveDiaryEntryHandler.Handle(request);
        return Created();
    }

    [HttpGet]
    public async Task<IActionResult> Fetch([FromQuery] DateOnly? date = null)
    {
        var response = await fetchDiaryEntriesHandler.Handle(date);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateRequest request)
    {
        var updateRequest = new IUpdateDiaryEntryHandler.Request(id, request.Title, request.Content);
        await updateDiaryEntryHandler.Handle(updateRequest);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleteRequest = new IDeleteDiaryEntryHandler.Request(id);
        await deleteDiaryEntryHandler.Handle(deleteRequest);
        return NoContent();
    }

    public record UpdateRequest(string Title, string Content);
}
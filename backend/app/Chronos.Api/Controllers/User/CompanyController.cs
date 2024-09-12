using Chronos.Api.Handlers.Company;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers.User;

[ApiController]
[Route("api/user/company")]
public class CompanyController(
    ISaveCompanyHandler saveCompanyHandler,
    IUpdateCompanyHandler updateCompanyHandler,
    IFetchCurrentCompanyHandler fetchCurrentCompanyHandler) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Save([FromBody] ISaveCompanyHandler.Request request)
    {
        await saveCompanyHandler.Handle(request);
        return Created();
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> FetchCurrent()
    {
        var response = await fetchCurrentCompanyHandler.Handle();
        return Ok(response);
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] IUpdateCompanyHandler.Request request)
    {
        await updateCompanyHandler.Handle(request);
        return Ok();
    }
}

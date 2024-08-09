using Chronos.Api.Handlers.Company;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chronos.Api.Controllers;

[ApiController]
[Route("api/company")]
public class CompanyController(
    ISaveCompanyHandler saveCompanyHandler,
    IUpdateCompanyHandler updateCompanyHandler,
    IDeleteCompanyHandler deleteCompanyHandler,
    IFetchCompanyHandler fetchCompanyHandler) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Save([FromBody] ISaveCompanyHandler.Request request)
    {
        await saveCompanyHandler.Handle(request);
        return Created();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCompany([FromRoute] Guid id)
    {
        var request = new IDeleteCompanyHandler.Request(id);
        await deleteCompanyHandler.Handle(request);
        return (Ok());
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> FetchCompany([FromRoute] Guid id, [FromRoute] string? cnpj)
    {
        var request = new IFetchCompanyHandler.Request(id, cnpj);
        var response = await fetchCompanyHandler.Handle(request);
        return Ok(response);
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateCompany([FromBody] IUpdateCompanyHandler.Request request)
    {
        await updateCompanyHandler.Handle(request);
        return Ok();
    }
}

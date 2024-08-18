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
    IFetchCompaniesHandler fetchCompaniesHandler) : ControllerBase
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
    [HttpGet]
    public async Task<IActionResult> FetchCompany(
        [FromQuery] int page, 
        [FromQuery] int size, 
        [FromQuery] Guid? id, 
        [FromQuery] string? cnpj)
    {
        var request = new IFetchCompaniesHandler.Request(page, size, id, cnpj);
        var response = await fetchCompaniesHandler.Handle(request);
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

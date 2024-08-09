using Chronos.Api.Handlers.Company;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Chronos.Api.Handlers.User;

namespace Chronos.Api.Controllers
{
    [Route("api/company")]
    [ApiController]
    public class CompanyController(
        ISaveCompanyHandler saveCompanyHandler,
        IUpdateCompanyHandler updateCompanyHandler,
        IDeleteCompanyHandler deleteCompanyHandler,
        IFetchCompanyHandler fetchCompanyHandler): ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Save([FromBody] ISaveCompanyHandler.Request request)
        {
            await saveCompanyHandler.Handle(request);
            return Created();
        }

        [Authorize]
        [HttpDelete("{companyId}")]
        public async Task<IActionResult> DeleteCompany([FromRoute] Guid companyId)
        {
            var request = new IDeleteCompanyHandler.Request(companyId);
            await deleteCompanyHandler.Handle(request);
            return(Ok());
        }
        
        [Authorize]
        [HttpGet("{companyId}")]
        public async Task<IActionResult> FetchCompany([FromRoute] Guid companyId, [FromRoute] string cnpj = null)
        {
            var request = new IFetchCompanyHandler.Request(companyId, cnpj);
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
}

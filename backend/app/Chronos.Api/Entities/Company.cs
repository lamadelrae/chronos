using Chronos.Api.Entities.Base;
using Chronos.Api.Entities.Enums;

namespace Chronos.Api.Entities;

public class Company : Entity
{
    public string Name { get; set; } = string.Empty;
    public string SocialReason { get; set; } = string.Empty;
    public string Cnpj { get; set; } = string.Empty;
    public CompanyAddress Address { get; set; } = null!;

    public class CompanyAddress
    {
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public State State { get; set; }
        public string ZipCode { get; set; } = string.Empty;
    }
}

using Chronos.Api.Entities.Base;

namespace Chronos.Api.Entities;

public class User : Entity
{
    public Guid CompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    public Company Company { get; set; } = null!;
}

using Chronos.Api.Entities.Base;

namespace Chronos.Api.Entities;

public class Product : Entity
{
    public Guid CompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }

    public Company Company { get; set; } = null!;
}

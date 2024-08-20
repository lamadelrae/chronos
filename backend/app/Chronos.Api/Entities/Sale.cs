using Chronos.Api.Entities.Base;

namespace Chronos.Api.Entities;

public class Sale : Entity
{
    public Guid CompanyId { get; set; }
    public DateTime Date { get; set; }
    public decimal Total { get; set; }

    public ICollection<SaleItem> Items { get; set; } = [];
    public Company Company { get; set; } = null!;
}

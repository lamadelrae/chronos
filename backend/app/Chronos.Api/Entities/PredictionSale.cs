using Chronos.Api.Entities.Base;

namespace Chronos.Api.Entities;

public class PredictionSale : Entity
{
    public Guid PredictionId { get; set; }
    public DateOnly Date { get; set; }
    public decimal Quantity { get; set; }
}

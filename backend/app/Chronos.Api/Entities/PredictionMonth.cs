using Chronos.Api.Entities.Base;

namespace Chronos.Api.Entities;

public class PredictionMonth : Entity
{
    public Guid PredictionYearId { get; set; }
    public int Month { get; set; }
    public decimal Quantity { get; set; }
}

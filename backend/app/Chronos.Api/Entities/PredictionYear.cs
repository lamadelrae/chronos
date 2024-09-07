using Chronos.Api.Entities.Base;

namespace Chronos.Api.Entities;

public class PredictionYear : Entity
{
    public Guid PredictionId { get; set; }
    public int Year { get; set; }
    public decimal Quantity { get; set; }

    public ICollection<PredictionMonth> Months { get; set; }
}

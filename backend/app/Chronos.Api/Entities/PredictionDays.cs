using Chronos.Api.Entities.Base;

namespace Chronos.Api.Entities;

public class PredictionDays : Entity
{
    public Guid PredictionId { get; set; }
    public DateOnly Date { get; set; }
    public int Quantity { get; set; }
}

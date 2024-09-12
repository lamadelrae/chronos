using Chronos.Api.Entities.Base;

namespace Chronos.Api.Entities;

public class Prediction : Entity
{
    public Guid ProductId { get; set; }
    public ICollection<PredictionSale> Sales { get; set; } = null!;
}

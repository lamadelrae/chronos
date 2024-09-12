using Chronos.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chronos.Api.Data.Mappings;

public class PredictionMap : IEntityTypeConfiguration<Prediction>
{
    public void Configure(EntityTypeBuilder<Prediction> builder)
    {
        builder.HasKey(prediction => prediction.Id);
        builder.Property(prediction => prediction.ProductId).IsRequired();
        builder.HasMany(prediction => prediction.Sales).WithOne().IsRequired();
    }
}

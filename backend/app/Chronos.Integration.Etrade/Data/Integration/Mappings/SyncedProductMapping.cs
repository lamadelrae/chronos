using Chronos.Integration.Etrade.Models.Integration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chronos.Integration.Etrade.Data.Integration.Mappings;

public class SyncedProductMapping : IEntityTypeConfiguration<SyncedProduct>
{
    public void Configure(EntityTypeBuilder<SyncedProduct> builder)
    {
        builder.HasKey(x => x.ChronosId);
        builder.Property(x => x.EtradeId).IsRequired();
        builder.Property(x => x.LastUpdate).IsRequired();
    }
}

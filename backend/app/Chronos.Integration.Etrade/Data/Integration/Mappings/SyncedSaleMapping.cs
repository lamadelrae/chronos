using Chronos.Integration.Etrade.Models.Integration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chronos.Integration.Etrade.Data.Integration.Mappings;

public class SyncedSaleMapping : IEntityTypeConfiguration<SyncedSale>
{
    public void Configure(EntityTypeBuilder<SyncedSale> builder)
    {
        builder.HasKey(x => x.ChronosId);
        builder.Property(x => x.EtradeId).IsRequired();
        builder.Property(x => x.LastUpdate).IsRequired();
    }
}

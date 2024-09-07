using Chronos.Integration.Etrade.Models.Integration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chronos.Integration.Etrade.Data.Integration.Mappings;

public class SyncedSaleMapping : IEntityTypeConfiguration<SyncedSale>
{
    public void Configure(EntityTypeBuilder<SyncedSale> builder)
    {
        builder.HasKey(x => x.Id);
    }
}

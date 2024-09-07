using Chronos.Integration.Etrade.Models.Integration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chronos.Integration.Etrade.Data.Integration.Mappings;

public class LastSyncMapping : IEntityTypeConfiguration<LastSync>
{
    public void Configure(EntityTypeBuilder<LastSync> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Value).IsRequired();
    }
}

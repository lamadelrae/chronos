using Chronos.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chronos.Api.Data.Mappings;

public class CompanyMap : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(x => x.SocialReason)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(x => x.Cnpj)
            .IsRequired()
            .HasMaxLength(14);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.LastUpdate)
            .IsRequired();

        builder.OwnsOne(x => x.Address, o =>
        {
            o.Property(e => e.Address).IsRequired();
            o.Property(e => e.City).IsRequired();
            o.Property(e => e.State).IsRequired();
            o.Property(e => e.ZipCode).IsRequired();
        });
    }
}

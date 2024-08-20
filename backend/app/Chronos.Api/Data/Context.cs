using Chronos.Api.Data.Mappings;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Api.Data;

public class Context(DbContextOptions options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfiguration(new UserMap());
        builder.ApplyConfiguration(new CompanyMap());
        builder.ApplyConfiguration(new ProductMap());
        builder.ApplyConfiguration(new SaleMap());
        builder.ApplyConfiguration(new SaleItemMap());
    }
}

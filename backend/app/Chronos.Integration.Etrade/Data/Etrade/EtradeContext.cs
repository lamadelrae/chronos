using Microsoft.EntityFrameworkCore;

namespace Chronos.Integration.Etrade.Data.Etrade;

public class EtradeContext(DbContextOptions<EtradeContext> options) : DbContext(options);
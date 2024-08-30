using Chronos.Integration.Etrade;
using Chronos.Integration.Etrade.Data.Etrade;
using Chronos.Integration.Etrade.Data.Integration;
using Chronos.Integration.Etrade.Handlers;
using Chronos.Integration.Etrade.Services;
using Microsoft.EntityFrameworkCore;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Worker>();

builder.Services.AddHttpClient("Chronos", options => 
{
    options.BaseAddress = new Uri(builder.Configuration.GetValue<string?>("Integration:ApiUrl") ?? string.Empty);
});

builder.Services.AddDbContext<EtradeContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetValue<string?>("Etrade:Connection"));
});
builder.Services.AddScoped<IChronosProductService, ChronosProductService>();
builder.Services.AddScoped<IProductSyncHandler, ProductSyncHandler>();
builder.Services.AddDbContext<IntegrationContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetValue<string?>("Integration:Connection"));
});

var host = builder.Build();
host.Run();

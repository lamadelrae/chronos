using Chronos.Api.ApiConcerns;
using Chronos.Api.Data;
using Chronos.Api.Handlers.Auth;
using Chronos.Api.Handlers.Company;
using Chronos.Api.Handlers.Product;
using Chronos.Api.Handlers.Sale;
using Chronos.Api.Handlers.User;
using Chronos.Api.Shared.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<Context>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Chronos"));
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(type => type.FriendlyId());

    options.AddSecurityDefinition("Authorization", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Authorization",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Authorization" } }, Array.Empty<string>() }
    });
});

builder.Services.AddScoped<IAuthHandler, AuthHandler>();
builder.Services
    .AddScoped<ISaveProductHandler, SaveProductHandler>()
    .AddScoped<IUpdateProductHandler, UpdateProductHandler>()
    .AddScoped<IDeleteProductHandler, DeleteProductHandler>()
    .AddScoped<IFetchProductHandler, FetchProductHandler>()
    .AddScoped<IFetchProductsHandler, FetchProductsHandler>();

builder.Services
    .AddScoped<ISaveSaleHandler, SaveSaleHandler>()
    .AddScoped<IFetchSaleHandler, FetchSaleHandler>()
    .AddScoped<IFetchSalesHandler, FetchSalesHandler>()
    .AddScoped<IUpdateSaleHandler, UpdateSaleHandler>()
    .AddScoped<IDeleteSaleHandler, DeleteSaleHandler>();

builder.Services
    .AddScoped<ISaveUserHandler, SaveUserHandler>()
    .AddScoped<IFetchUserHandler, FetchUsersHandler>()
    .AddScoped<IUpdateUserHandler, UpdateUserHandler>()
    .AddScoped<IDeleteUserHandler, DeleteUserHandler>();

builder.Services
    .AddScoped<ISaveCompanyHandler, SaveCompanyHandler>()
    .AddScoped<IFetchCompanyHandler, FetchCompanyHandler>()
    .AddScoped<IUpdateCompanyHandler, UpdateCompanyHandler>()
    .AddScoped<IDeleteCompanyHandler, DeleteCompanyHandler>();

builder.Services.AddTransient<ExceptionHandlingMiddleware>();
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtOptionsProvider.GetProvider(builder.Configuration));

var app = builder.Build();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

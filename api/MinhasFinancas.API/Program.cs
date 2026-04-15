using MinhasFinancas.API.Extensions;
using MinhasFinancas.API.Middlewares;
using MinhasFinancas.Domain.Interfaces;
using MinhasFinancas.Infrastructure;
using MinhasFinancas.Infrastructure.Data;
using Asp.Versioning;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerGen(options =>
{
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"));
});

// Add Controllers
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add API Versioning
builder.Services.AddApiVersioning(options =>
{
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.ReportApiVersions = true;
});

// Add Infrastructure services (DbContext)
builder.Services.AddInfrastructureServices(builder.Configuration);

// Add Application services
builder.Services.AddApplicationServices();

var app = builder.Build();

// Ensure database is created and seeded only in development
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<MinhasFinancasDbContext>();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
        dbContext.Database.EnsureCreated();
        await SeedData.InitializeAsync(unitOfWork);
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use Exception Middleware
app.UseExceptionMiddleware();

// Use CORS
app.UseCors("AllowAll");

// Use Controllers
app.MapControllers();

// Redirect root to Swagger UI for convenience
app.MapGet("/", () => Results.Redirect("/swagger"));
app.Run();

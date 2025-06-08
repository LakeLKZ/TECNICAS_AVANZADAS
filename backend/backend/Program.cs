using Microsoft.EntityFrameworkCore;
using backend.Data;
using System.Text.Json.Serialization;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Configurar la conexión y mapeo de enums
var dataSourceBuilder = new NpgsqlDataSourceBuilder(
    builder.Configuration.GetConnectionString("DefaultConnection")
);
dataSourceBuilder.MapEnum<backend.Models.Position>("banner_position");
dataSourceBuilder.MapEnum<backend.Models.RenewalType>("renewaltype");
dataSourceBuilder.MapEnum<backend.Models.RenewalPeriod>("renewalperiod");
var dataSource = dataSourceBuilder.Build();

// Servicios
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(opts =>
    opts.UseNpgsql(dataSource)
);

// CORS: permitir desde Angular (4200) y desde el frontend servido en 80
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost", "http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
        // Si deseas permitir cualquier origen en desarrollo:
        // policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Aplicar migraciones al arrancar
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

// Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseCors("AllowAngular");
app.UseAuthorization();
app.MapControllers();

app.Run();

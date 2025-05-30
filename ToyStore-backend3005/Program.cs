using Microsoft.EntityFrameworkCore;
using ToyStore.Models;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("WebCodeDb")));

// Add controllers
builder.Services.AddControllers();

// Cấu hình CORS: Cho phép gọi từ React (localhost:3000) và Swagger UI (localhost:5228)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5228")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Bật Swagger UI ở môi trường dev
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Bắt buộc bật CORS trước các middleware khác
app.UseCors("AllowFrontend");

// Https redirect nếu muốn (có thể tắt nếu dùng http)
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

using back_end.Models.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using back_end.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
// CORS policy để cho phép FE truy cập API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin() // kết nối FE ở bất kỳ domain nào
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");
        c.RoutePrefix = string.Empty;
    });
}
/////////***Phần Quân
// Add services to the container
builder.Services.AddControllers();

// 1. Đăng ký DbContext
builder.Services.AddDbContext<WebCodeContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Đăng ký Controllers để MapControllers hoạt động
builder.Services.AddControllers();

// 3. Bật CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// 4. Dùng CORS
app.UseCors("AllowAll");
////////***** 
/// 
/// 
// 5. Chuyển hướng HTTPS
app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors("AllowLocalhost3000");
app.MapControllers();
// Chỉ dùng HTTPS redirection khi có HTTPS port
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

// Sử dụng CORS trước khi map controllers
app.UseCors("AllowFrontend");

// 6. Bật routing cho API Controllers
app.UseAuthorization();
app.MapControllers();

// 7. (Giữ code mẫu nếu cần)
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// Thêm dòng này để map Controllers
app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

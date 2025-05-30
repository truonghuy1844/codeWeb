using Microsoft.EntityFrameworkCore;
using back_end.Data;

var builder = WebApplication.CreateBuilder(args);

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

// 5. Chuyển hướng HTTPS
app.UseHttpsRedirection();

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

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

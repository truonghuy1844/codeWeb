using Microsoft.EntityFrameworkCore;

namespace ToyStore.Models;

public class WebCodeContext : DbContext
{
    public WebCodeContext(DbContextOptions<WebCodeContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Brand> Brands { get; set; }
    public DbSet<Category> Categories { get; set; }
}

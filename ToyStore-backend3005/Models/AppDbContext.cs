using Microsoft.EntityFrameworkCore;

namespace ToyStore.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserDetails> UserDetails { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductInventory> ProductInventories { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Shipment> Shipments { get; set; }
        public DbSet<ShipmentDetail> ShipmentDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cart>().HasKey(c => new { c.UserId, c.ProductId });
            modelBuilder.Entity<OrderDetail>().HasKey(od => new { od.OrderId, od.ProductId, od.ProductInventoryId });
            modelBuilder.Entity<Rating>().HasKey(r => new { r.UserId, r.ProductId });
            modelBuilder.Entity<ShipmentDetail>().HasKey(sd => new { sd.ShipmentId, sd.ProductId, sd.OrderId });

        }
    }
}

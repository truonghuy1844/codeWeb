using Microsoft.EntityFrameworkCore;
using back_end.Models;

    // Example of DbContext class
namespace back_end.Data{

    public class WebCodeContext : DbContext
    {

        public WebCodeContext(DbContextOptions<WebCodeContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserDetails> UserDetails { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductInventory> ProductInventories { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<PromotionProduct> PromotionProducts { get; set; }
        public DbSet<Tax> Taxes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<LogHistory> LogHistories { get; set; }
        public DbSet<ChangeHistory> ChangeHistories { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Shipment> Shipments { get; set; }
        public DbSet<ShipmentDetail> ShipmentDetails { get; set; }
        public DbSet<Support> Supports { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<ChatMember> ChatMembers { get; set; }
        public DbSet<ChatDetail> ChatDetails { get; set; }
        public DbSet<ClickProduct> ClickProducts { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cart>()
            .HasKey(c => new { c.UserId, c.ProductId }); // khóa chính tổng hợp
        base.OnModelCreating(modelBuilder);
    }
}
}

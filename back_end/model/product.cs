using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models
{
    [Table("product")]
    public class Product
    {
        [Key]
        [StringLength(25)]
        [Column("product_id")]
        public string ProductId { get; set; }

        [Required]
        [StringLength(75)]
        [Column("name")]
        public string Name { get; set; }

        [StringLength(75)]
        [Column("name2")]
        public string Name2 { get; set; }

        [StringLength(1000)]
        [Column("description")]
        public string Description { get; set; }

        [StringLength(25)]
        [Column("brand_id")]
        public string BrandId { get; set; }

        [Required]
        [StringLength(25)]
        [Column("category_id")]
        public string CategoryId { get; set; }

        [StringLength(25)]
        [Column("group_tb_1")]
        public string GroupId1 { get; set; }

        [StringLength(25)]
        [Column("group_tb_2")]
        public string GroupId2 { get; set; }

        [StringLength(25)]
        [Column("group_tb_3")]
        public string GroupId3 { get; set; }

        [StringLength(25)]
        [Column("group_tb_4")]
        public string GroupId4 { get; set; }

        [StringLength(20)]
        [Column("uom")]
        public string UnitOfMeasure { get; set; }

        [Column("price1")]
        public decimal? Price1 { get; set; }

        [Column("date_apply1")]
        public DateTime? DateApply1 { get; set; }

        [Column("price2")]
        public decimal? Price2 { get; set; }

        [Column("date_apply2")]
        public DateTime? DateApply2 { get; set; }

        [StringLength(300)]
        [Column("url_image1")]
        public string UrlImage1 { get; set; }

        [StringLength(300)]
        [Column("url_image2")]
        public string UrlImage2 { get; set; }

        [StringLength(300)]
        [Column("url_image3")]
        public string UrlImage3 { get; set; }

        [StringLength(25)]
        [Column("user_id")]
        public string UserId { get; set; }

        [Column("status")]
        public bool Status { get; set; } = true;

        // Navigation properties
        [ForeignKey("CategoryId")]
        public Category Category { get; set; }

        [ForeignKey("GroupId1")]
        public Group Group1 { get; set; }

        [ForeignKey("GroupId2")]
        public Group Group2 { get; set; }

        [ForeignKey("GroupId3")]
        public Group Group3 { get; set; }

        [ForeignKey("GroupId4")]
        public Group Group4 { get; set; }

        [ForeignKey("BrandId")]
        public Brand Brand { get; set; }

        public ICollection<ProductInventory> ProductInventories { get; set; }
        public ICollection<PromotionProduct> PromotionProducts { get; set; }
        public ICollection<Cart> Carts { get; set; }
        public ICollection<OrderDetail> OrderDetails { get; set; }
        public ICollection<Wishlist> Wishlists { get; set; }
        public ICollection<Rating> Ratings { get; set; }
        public ICollection<ShipmentDetail> ShipmentDetails { get; set; }
        public ICollection<Support> Supports { get; set; }
        public ICollection<ClickProduct> ClickProducts { get; set; }
    }


    [Table("product_in")]
    public class ProductInventory
    {
        [Key]
        [StringLength(25)]
        [Column("pi_id")]
        public string ProductInventoryId { get; set; }

        [Required]
        [StringLength(25)]
        [Column("product_id")]
        public string ProductId { get; set; }

        [Column("date_created")]
        public DateTime? DateCreated { get; set; }

        [Column("date_start")]
        public DateTime DateStart { get; set; } = DateTime.Now;

        [Column("date_end")]
        public DateTime? DateEnd { get; set; }

        [Required]
        [StringLength(75)]
        [Column("name")]
        public string Name { get; set; }

        [StringLength(75)]
        [Column("name2")]
        public string Name2 { get; set; }

        [Column("quantity")]
        public int? Quantity { get; set; }

        [Column("cost")]
        public decimal? Cost { get; set; }

        // Navigation properties
        [ForeignKey("ProductId")]
        public Product Product { get; set; }
        
        public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}

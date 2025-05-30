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
        public string ProductId { get; set; } = string.Empty;

        [Required]
        [StringLength(75)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [StringLength(75)]
        [Column("name2")]
        public string? Name2 { get; set; }

        [StringLength(1000)]
        [Column("description")]
        public string? Description { get; set; }

        [StringLength(25)]
        [Column("brand_id")]
        public string? BrandId { get; set; }

        [Required]
        [StringLength(25)]
        [Column("category_id")]
        public string CategoryId { get; set; } = string.Empty;

        [StringLength(25)]
        [Column("group_tb_1")]
        public string? GroupTb1 { get; set; }

        [StringLength(25)]
        [Column("group_tb_2")]
        public string? GroupTb2 { get; set; }

        [StringLength(25)]
        [Column("group_tb_3")]
        public string? GroupTb3 { get; set; }

        [StringLength(25)]
        [Column("group_tb_4")]
        public string? GroupTb4 { get; set; }

        [StringLength(20)]
        [Column("uom")]
        public string? Uom { get; set; }

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
        public string? UrlImage1 { get; set; }

        [StringLength(300)]
        [Column("url_image2")]
        public string? UrlImage2 { get; set; }

        [StringLength(300)]
        [Column("url_image3")]
        public string? UrlImage3 { get; set; }

        [Required]
        [StringLength(25)]
        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;

        [Column("status")]
        public bool Status { get; set; } = true;
            // Navigation Properties
        public virtual Category? Category { get; set; }
        public virtual Brand? Brand { get; set; }
        public virtual User? User { get; set; }
    }


    [Table("product_in")]
    public class ProductInventory
    {
        [Key]
        [StringLength(25)]
        [Column("pi_id")]
        public string ProductInventoryId { get; set; } = string.Empty;

        [Required]
        [StringLength(25)]
        [Column("product_id")]
        public string ProductId { get; set; } = string.Empty;

        [Column("date_created")]
        public DateTime? DateCreated { get; set; }

        [Column("date_start")]
        public DateTime DateStart { get; set; } = DateTime.Now;

        [Column("date_end")]
        public DateTime? DateEnd { get; set; }

        [Required]
        [StringLength(75)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [StringLength(75)]
        [Column("name2")]
        public string? Name2 { get; set; }

        [Column("quantity")]
        public int? Quantity { get; set; }

        [Column("cost")]
        public decimal? Cost { get; set; }

        // Navigation properties
        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
        
        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}
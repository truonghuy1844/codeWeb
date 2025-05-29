using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace back_end.Models
{ 
      [Table("promotion")]
    public class Promotion
    {
        [Key]
        [StringLength(25)]
        [Column("promotion_id")]
        public string PromotionId { get; set; }

        [Required]
        [StringLength(75)]
        [Column("promotion_name")]
        public string PromotionName { get; set; }

        [StringLength(75)]
        [Column("promotion_name2")]
        public string PromotionName2 { get; set; }

        [Column("type")]
        public int Type { get; set; }

        [Column("calculate")]
        public int Calculate { get; set; }

        [Column("date_created")]
        public DateTime? DateCreated { get; set; }

        [Column("date_start")]
        public DateTime DateStart { get; set; }

        [Column("date_end")]
        public DateTime? DateEnd { get; set; }

        [Column("value")]
        public int? Value { get; set; }

        [Column("quantity")]
        public int? Quantity { get; set; }

        [StringLength(1000)]
        [Column("description")]
        public string Description { get; set; }

        [Column("quan_cond")]
        public int? QuantityCondition { get; set; }

        [Column("val_cond")]
        public decimal? ValueCondition { get; set; }

        [Column("oder_tb_cond")]
        public int? OrderCondition { get; set; }

        [StringLength(25)]
        [Column("group_tb_cond")]
        public string GroupCondition { get; set; }

        [Column("rank_cond")]
        public int? RankCondition { get; set; }

        [Column("status")]
        public bool Status { get; set; } = true;

        // Navigation properties
        public ICollection<PromotionProduct> PromotionProducts { get; set; }
        public ICollection<Order> OrdersShipPromotion { get; set; }
        public ICollection<Order> OrdersNewPromotion { get; set; }
        public ICollection<Order> OrdersSaleOffPromotion { get; set; }
        public ICollection<Order> OrdersDiscountPromotion { get; set; }
    }

    [Table("promotion_product")]
    [PrimaryKey(nameof(PromotionId), nameof(ProductId))]
    public class PromotionProduct
    {
        [Required]
        [Column("promotion_id", Order = 0)]
        [StringLength(25)]
        public string PromotionId { get; set; }

        [Required]
        [Column("product_id", Order = 1)]
        [StringLength(25)]
        public string ProductId { get; set; }

        [Column("status")]
        public bool Status { get; set; } = true;

        // Navigation properties
        [ForeignKey("PromotionId")]
        public Promotion Promotion { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }
    }
}
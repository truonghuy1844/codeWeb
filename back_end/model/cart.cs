using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace back_end.Models
{
    [Table("cart")]
    [PrimaryKey(nameof(UserId), nameof(ProductId))]
    public class Cart
    {
        [Required]
        [Column("user_id", Order = 0)]
        public int UserId { get; set; }

        [Required]
        [Column("product_id", Order = 1)]
        [StringLength(25)]
        public string ProductId { get; set; }

        [StringLength(75)]
        [Column("product_name")]
        public string ProductName { get; set; }

        [Column("quantity")]
        public int? Quantity { get; set; }

        [Column("price")]
        public decimal? Price { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToyStore.Models
{
    // Cart.cs
    [Table("cart")]
    public class Cart
    {
        [Column("user_id", Order = 0)]
        public int UserId { get; set; }

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

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
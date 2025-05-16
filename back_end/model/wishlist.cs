using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models
{
    [Table("wishlist")]
    public class Wishlist
    {
        [Key]
        [Column("user_id", Order = 0)]
        public int UserId { get; set; }

        [Key]
        [Column("product_id", Order = 1)]
        [StringLength(25)]
        public string ProductId { get; set; }

        [StringLength(25)]
        [Column("product_name")]
        public string ProductName { get; set; }

        [StringLength(1000)]
        [Column("product_description")]
        public string ProductDescription { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }
    }
}
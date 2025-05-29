using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models
{ 
     [Table("rating")]
    public class Rating
    {
     
        [Column("product_id", Order = 0)]
        [StringLength(25)]
        public string ProductId { get; set; }

       
        [Column("user_id", Order = 1)]
        public int UserId { get; set; }

        [Column("date_created")]
        public DateTime? DateCreated { get; set; }

        [Column("rate")]
        public int? Rate { get; set; }

        [StringLength(1000)]
        [Column("description")]
        public string Description { get; set; }

        // Navigation properties
        [ForeignKey("ProductId")]
        public Product Product { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
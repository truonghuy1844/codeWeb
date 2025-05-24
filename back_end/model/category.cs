using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models
{
    [Table("category")]
    public class Category
    {
        [Key]
        [StringLength(25)]
        [Column("category_id")]
        public string CategoryId { get; set; }

        [Required]
        [StringLength(75)]
        [Column("category_name")]
        public string CategoryName { get; set; }

        [StringLength(75)]
        [Column("category_name2")]
        public string CategoryName2 { get; set; }

        [StringLength(1000)]
        [Column("description")]
        public string Description { get; set; }

        [Column("status")]  
        public bool Status { get; set; } = true;

        // Navigation property
        public ICollection<Product> Products { get; set; }
    }

}
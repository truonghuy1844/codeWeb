using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models
{
    [Table("brand")]
    public class Brand
    {
        [Key]
        [StringLength(25)]
        [Column("brand_id")]
        public string BrandId { get; set; }

        [Required]
        [StringLength(75)]
        [Column("brand_name")]
        public string BrandName { get; set; }

        [StringLength(75)]
        [Column("brand_name2")]
        public string BrandName2 { get; set; }

        [StringLength(1000)]
        [Column("description")]
        public string Description { get; set; }

        [Column("status")]
        public bool Status { get; set; } = true;

        // Navigation property
        public ICollection<Product> Products { get; set; }
    }
}
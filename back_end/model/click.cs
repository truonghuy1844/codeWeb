using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models
{
     [Table("click_product")]
    public class ClickProduct
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int click_rec { get; set; }
        
        [Required]
        [StringLength(25)]
        public string product_id { get; set; }
        
        [Required]
        public int user_id { get; set; }
        
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime date_click { get; set; }
        
        // Navigation properties (optional - for Entity Framework relationships)
        public virtual Product Product { get; set; }
        public virtual User User { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToyStore.Models
{
    [Table("product_in")]
    public class ProductInventory
    {
        [Key]
        [Column("pi_id")]
        public string ProductInventoryId { get; set; }

        [Column("product_id")]
        public string ProductId { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }
    }
}
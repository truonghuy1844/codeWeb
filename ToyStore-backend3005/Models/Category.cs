using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToyStore.Models;

[Table("category")]
public class Category
{
    [Key]
    [Column("category_id")]
    public string CategoryId { get; set; } = null!;

    [Column("category_name")]
    public string CategoryName { get; set; } = null!;

    [Column("status")]
    public bool? Status { get; set; }

    // Danh sách sản phẩm thuộc category
    public ICollection<Product> Products { get; set; } = new List<Product>();
}

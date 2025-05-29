using System.ComponentModel.DataAnnotations.Schema;

namespace ToyStore.Models;

[Table("category")]
public class Category
{
    [Column("category_id")]
    public string CategoryId { get; set; } = null!;

    [Column("category_name")]
    public string CategoryName { get; set; } = null!;

    [Column("status")]
    public bool? Status { get; set; }
}

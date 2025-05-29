using System.ComponentModel.DataAnnotations.Schema;

namespace ToyStore.Models;

[Table("product")]
public class Product
{
    [Column("product_id")]
    public string ProductId { get; set; } = null!;

    [Column("name")]
    public string Name { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }

    [Column("brand_id")]
    public string? BrandId { get; set; }

    [Column("category_id")]
    public string CategoryId { get; set; } = null!;

    [Column("url_image1")]
    public string? UrlImage1 { get; set; }

    [Column("price1")]
    public decimal? Price1 { get; set; }

    [Column("status")]
    public bool? Status { get; set; }
}

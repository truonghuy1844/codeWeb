using System.ComponentModel.DataAnnotations.Schema;

namespace ToyStore.Models;

[Table("brand")]
public class Brand
{
    [Column("brand_id")]
    public string BrandId { get; set; } = null!;

    [Column("brand_name")]
    public string BrandName { get; set; } = null!;

    [Column("status")]
    public bool? Status { get; set; }
}

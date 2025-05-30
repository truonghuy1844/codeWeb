using System;
using System.Collections.Generic;

namespace back_end.Models.Entity
{
    public partial class Brand
{
    public string BrandId { get; set; } = null!;

    public string BrandName { get; set; } = null!;

    public string? BrandName2 { get; set; }

    public string? Description { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}

}


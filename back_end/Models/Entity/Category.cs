using System;
using System.Collections.Generic;

namespace back_end.Models.Entity
{
    public partial class Category
{
    public string CategoryId { get; set; } = null!;

    public string CategoryName { get; set; } = null!;

    public string? CategoryName2 { get; set; }

    public string? Description { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}

}


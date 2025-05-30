using System;
using System.Collections.Generic;

namespace back_end.Models.Entity
{
    
public partial class ProductIn
{
    public string PiId { get; set; } = null!;

    public string ProductId { get; set; } = null!;

    public DateTime? DateCreated { get; set; }

    public DateTime? DateStart { get; set; }

    public DateTime? DateEnd { get; set; }

    public string Name { get; set; } = null!;

    public string? Name2 { get; set; }

    public int? Quantity { get; set; }

    public decimal? Cost { get; set; }

    public virtual ICollection<OrderD> OrderDs { get; set; } = new List<OrderD>();

    public virtual Product Product { get; set; } = null!;
}

}
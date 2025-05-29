using System;
using System.Collections.Generic;

namespace back_end.Models.Entity;

public partial class Cart
{
    public int UserId { get; set; }

    public string ProductId { get; set; } = null!;

    public string? ProductName { get; set; }

    public int? Quantity { get; set; }

    public decimal? Price { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}

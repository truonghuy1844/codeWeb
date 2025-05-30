using System;
using System.Collections.Generic;

namespace back_end.Models.Entity
{
public partial class Wishlist
{
    public int UserId { get; set; }

    public string ProductId { get; set; } = null!;

    public string? ProductName { get; set; }

    public string? ProductDescription { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}

}


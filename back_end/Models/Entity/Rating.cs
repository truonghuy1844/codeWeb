using System;
using System.Collections.Generic;

namespace back_end.Models.Entity;

public partial class Rating
{
    public string ProductId { get; set; } = null!;

    public int UserId { get; set; }

    public DateOnly? DateCreated { get; set; }

    public int? Rate { get; set; }

    public string? Description { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}

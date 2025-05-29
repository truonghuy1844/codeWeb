using System;
using System.Collections.Generic;

namespace back_end.Models.Entity;

public partial class ClickProduct
{
    public int ClickRec { get; set; }

    public string ProductId { get; set; } = null!;

    public int UserId { get; set; }

    public DateTime? DateClick { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}

using System;
using System.Collections.Generic;

namespace back_end.Models.Entity;

public partial class PromotionProduct
{
    public string PromotionId { get; set; } = null!;

    public string ProductId { get; set; } = null!;

    public bool? Status { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual Promotion Promotion { get; set; } = null!;
}

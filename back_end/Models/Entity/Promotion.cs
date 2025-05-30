using System;
using System.Collections.Generic;

namespace back_end.Models.Entity
{
    

public partial class Promotion
{
    public string PromotionId { get; set; } = null!;

    public string PromotionName { get; set; } = null!;

    public string? PromotionName2 { get; set; }

    public int Type { get; set; }

    public int Calculate { get; set; }

    public DateOnly? DateCreated { get; set; }

    public DateOnly DateStart { get; set; }

    public DateOnly? DateEnd { get; set; }

    public decimal? Value { get; set; }

    public int? Quantity { get; set; }

    public string? Description { get; set; }

    public int? QuanCond { get; set; }

    public decimal? ValCond { get; set; }

    public int? OderTbCond { get; set; }

    public string? GroupTbCond { get; set; }

    public int? RankCond { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<OrderTb> OrderTbProDiscountNavigations { get; set; } = new List<OrderTb>();

    public virtual ICollection<OrderTb> OrderTbProNewNavigations { get; set; } = new List<OrderTb>();

    public virtual ICollection<OrderTb> OrderTbProSaleoffNavigations { get; set; } = new List<OrderTb>();

    public virtual ICollection<OrderTb> OrderTbProShipNavigations { get; set; } = new List<OrderTb>();

    public virtual ICollection<PromotionProduct> PromotionProducts { get; set; } = new List<PromotionProduct>();
}

}
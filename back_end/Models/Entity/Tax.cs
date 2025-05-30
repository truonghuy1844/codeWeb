using System;
using System.Collections.Generic;

namespace back_end.Models.Entity
{
    public partial class Tax
{
    public string TaxId { get; set; } = null!;

    public int? SeqNum { get; set; }

    public string? TaxName { get; set; }

    public string? TaxName2 { get; set; }

    public DateOnly? DateCreated { get; set; }

    public DateOnly? DateStart { get; set; }

    public DateOnly? DateEnd { get; set; }

    public string? Description { get; set; }

    public decimal? Rate { get; set; }

    public int? QuanCond { get; set; }

    public decimal? ValCond { get; set; }

    public string? GroupTbCond { get; set; }

    public int? RankCond { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<OrderD> OrderDs { get; set; } = new List<OrderD>();
}

}


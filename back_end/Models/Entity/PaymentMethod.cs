using System;
using System.Collections.Generic;

namespace back_end.Models.Entity
{
    
public partial class PaymentMethod
{
    public string MethodId { get; set; } = null!;

    public string? Name { get; set; }

    public int? Type { get; set; }

    public string? Description { get; set; }

    public DateTime? DateCreated { get; set; }

    public int? FeeRate { get; set; }

    public string? Url { get; set; }

    public string? LogoUrl { get; set; }

    public string? Bank { get; set; }

    public int? NumAccount { get; set; }

    public string? NameAccount { get; set; }

    public bool? Refund { get; set; }

    public int? Sort { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}

}
using System;
using System.Collections.Generic;

namespace back_end.Models.Entity
{
    public partial class Invoice
{
    public string InvoiceId { get; set; } = null!;

    public string? OrderId { get; set; }

    public DateOnly? DateCreated { get; set; }

    public DateOnly? DatePayment { get; set; }

    public string? Method { get; set; }

    public decimal? Amount { get; set; }

    public decimal? ShipAmount { get; set; }

    public decimal? TaxAmount { get; set; }

    public decimal? Promotion { get; set; }

    public decimal? Cost { get; set; }

    public decimal? AmountPayable { get; set; }

    public decimal? Payment { get; set; }

    public decimal? Balanced { get; set; }

    public string? Description { get; set; }

    public int? Status { get; set; }

    public virtual PaymentMethod? MethodNavigation { get; set; }

    public virtual OrderTb? Order { get; set; }
}

}


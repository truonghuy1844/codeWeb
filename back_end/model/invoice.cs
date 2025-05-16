using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models
{
    [Table("invoice")]
public class Invoice
{
    [Key]
    [StringLength(25)]
    [Column("invoice_id")]
    public string InvoiceId { get; set; }

    [StringLength(25)]
    [Column("order_id")]
    public string OrderId { get; set; }

    [Column("date_created")]
    public DateTime? DateCreated { get; set; }

    [Column("date_payment")]
    public DateTime? DatePayment { get; set; }

    [StringLength(25)]
    [Column("method")]
    public string MethodId { get; set; }

    [Column("amount")]
    public decimal? Amount { get; set; }

    [Column("ship_amount")]
    public decimal? ShipAmount { get; set; }

    [Column("tax_amount")]
    public decimal? TaxAmount { get; set; }

    [Column("promotion")]
    public decimal? PromotionAmount { get; set; }

    [Column("cost")]
    public decimal? Cost { get; set; }

    [Column("amount_payable")]
    public decimal? AmountPayable { get; set; }

    [Column("payment")]
    public decimal? Payment { get; set; }

    [Column("balanced")]
    public decimal? Balanced { get; set; }

    [StringLength(1000)]
    [Column("description")]
    public string Description { get; set; }

    [Column("status")]
    public int Status { get; set; } = 1;

    // Navigation properties
    [ForeignKey("OrderId")]
    public Order Order { get; set; }

    [ForeignKey("MethodId")]
    public PaymentMethod PaymentMethod { get; set; }
}
}
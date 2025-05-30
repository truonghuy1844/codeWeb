using System;
using System.Collections.Generic;

namespace back_end.Models.Entity
{
    public partial class OrderTb
{
    public string OrderId { get; set; } = null!;

    public DateOnly? DateCreated { get; set; }

    public int? Buyer { get; set; }

    public int? Seller { get; set; }

    public string? ProShip { get; set; }

    public string? ProNew { get; set; }

    public string? ProSaleoff { get; set; }

    public string? ProDiscount { get; set; }

    public string? Description { get; set; }

    public int? Status { get; set; }

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual ICollection<OrderD> OrderDs { get; set; } = new List<OrderD>();

    public virtual Promotion? ProDiscountNavigation { get; set; }

    public virtual Promotion? ProNewNavigation { get; set; }

    public virtual Promotion? ProSaleoffNavigation { get; set; }

    public virtual Promotion? ProShipNavigation { get; set; }

    public virtual ICollection<ShipmentD> ShipmentDs { get; set; } = new List<ShipmentD>();

    public virtual ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();

    public virtual ICollection<Support> Supports { get; set; } = new List<Support>();
}

}


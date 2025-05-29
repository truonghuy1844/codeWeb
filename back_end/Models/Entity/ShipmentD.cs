using System;
using System.Collections.Generic;

namespace back_end.Models.Entity;

public partial class ShipmentD
{
    public string ShipmentId { get; set; } = null!;

    public string ProductId { get; set; } = null!;

    public string OrderId { get; set; } = null!;

    public int? Quantity { get; set; }

    public virtual OrderTb Order { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;

    public virtual Shipment Shipment { get; set; } = null!;
}

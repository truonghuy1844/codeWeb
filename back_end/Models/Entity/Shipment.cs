using System;
using System.Collections.Generic;

namespace back_end.Models.Entity;

public partial class Shipment
{
    public string ShipmentId { get; set; } = null!;

    public DateTime? DateCreated { get; set; }

    public DateTime? DateReceipt { get; set; }

    public DateTime? DateEstDeli { get; set; }

    public DateTime? DateActualDeli { get; set; }

    public string? Shipper1Id { get; set; }

    public string? Shipper1Name { get; set; }

    public string? Phone1 { get; set; }

    public string? Shipper2Id { get; set; }

    public string? Shipper2Name { get; set; }

    public string? Phone2 { get; set; }

    public string? OrderId { get; set; }

    public string? AddressId { get; set; }

    public string? NameReceive { get; set; }

    public string? PhoneReceive { get; set; }

    public string? Description { get; set; }

    public int? Status { get; set; }

    public virtual Address? Address { get; set; }

    public virtual OrderTb? Order { get; set; }

    public virtual ICollection<ShipmentD> ShipmentDs { get; set; } = new List<ShipmentD>();
}

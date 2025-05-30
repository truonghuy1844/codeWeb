using System;
using System.Collections.Generic;

namespace back_end.Models.Entity
{
public partial class Address
{
    public string AddressId { get; set; } = null!;

    public string? Name { get; set; }

    public string? Phone { get; set; }

    public string? Description { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }

    public string? District { get; set; }

    public string? Ward { get; set; }

    public string? Street { get; set; }

    public string? Detail { get; set; }

    public int? UserId { get; set; }

    public bool? Status { get; set; }

    public virtual ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();
}

}


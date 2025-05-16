using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models
{
[Table("address")]
    public class Address
    {
        [Key]
        [StringLength(25)]
        [Column("address_id")]
        public string AddressId { get; set; }

        [StringLength(75)]
        [Column("name")]
        public string Name { get; set; }

        [StringLength(10)]
        [Column("phone")]
        public string Phone { get; set; }

        [StringLength(1000)]
        [Column("description")]
        public string Description { get; set; }

        [StringLength(75)]
        [Column("country")]
        public string Country { get; set; }

        [StringLength(75)]
        [Column("city")]
        public string City { get; set; }

        [StringLength(75)]
        [Column("district")]
        public string District { get; set; }

        [StringLength(75)]
        [Column("ward")]
        public string Ward { get; set; }

        [StringLength(75)]
        [Column("street")]
        public string Street { get; set; }

        [StringLength(75)]
        [Column("detail")]
        public string Detail { get; set; }

        [StringLength(25)]
        [Column("user_id")]
        public string UserId { get; set; }

        [Column("status")]
        public bool Status { get; set; } = true;

        // Navigation property
        public ICollection<Shipment> Shipments { get; set; }
    }
}
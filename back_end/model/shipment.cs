using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace back_end.Models
{
    [Table("shipment")]
    public class Shipment
    {
        [Key]
        [StringLength(25)]
        [Column("shipment_id")]
        public string ShipmentId { get; set; }

        [Column("date_created")]
        public DateTime? DateCreated { get; set; }

        [Column("date_receipt")]
        public DateTime? DateReceipt { get; set; }

        [Column("date_est_deli")]
        public DateTime? DateEstimatedDelivery { get; set; }

        [Column("date_actual_deli")]
        public DateTime? DateActualDelivery { get; set; }

        [StringLength(25)]
        [Column("shipper1_id")]
        public string Shipper1Id { get; set; }

        [StringLength(75)]
        [Column("shipper1_name")]
        public string Shipper1Name { get; set; }

        [StringLength(10)]
        [Column("phone1")]
        public string Phone1 { get; set; }

        [StringLength(25)]
        [Column("shipper2_id")]
        public string Shipper2Id { get; set; }

        [StringLength(75)]
        [Column("shipper2_name")]
        public string Shipper2Name { get; set; }

        [StringLength(10)]
        [Column("phone2")]
        public string Phone2 { get; set; }

        [StringLength(25)]
        [Column("order_id")]
        public string OrderId { get; set; }

        [StringLength(25)]
        [Column("address_id")]
        public string AddressId { get; set; }

        [StringLength(75)]
        [Column("name_receive")]
        public string NameReceive { get; set; }

        [StringLength(10)]
        [Column("phone_receive")]
        public string PhoneReceive { get; set; }

        [StringLength(1000)]
        [Column("description")]
        public string Description { get; set; }

        [Column("status")]
        public int Status { get; set; } = 0;

        // Navigation properties
        [ForeignKey("OrderId")]
        public Order Order { get; set; }

        [ForeignKey("AddressId")]
        public Address Address { get; set; }

        public ICollection<ShipmentDetail> ShipmentDetails { get; set; }
    }

    [Table("shipment_d")]
    [PrimaryKey(nameof(ShipmentId), nameof(ProductId))]
    public class ShipmentDetail
    {
        [Column("shipment_id", Order = 0)]
        [StringLength(25)]
        public string ShipmentId { get; set; }

        [Column("product_id", Order = 1)]
        [StringLength(25)]
        public string ProductId { get; set; }


        [Column("order_id", Order = 2)]
        [StringLength(25)]
        public string OrderId { get; set; }

        [Column("quantity")]
        public int? Quantity { get; set; }

        // Navigation properties
        [ForeignKey("ShipmentId")]
        public Shipment Shipment { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }

        [ForeignKey("OrderId")]
        public Order Order { get; set; }
    }

}
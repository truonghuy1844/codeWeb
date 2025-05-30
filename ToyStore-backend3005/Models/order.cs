using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToyStore.Models
{
    [Table("order_tb")]
    public class Order
    {
        [Key]
        [StringLength(25)]
        [Column("order_id")]
        public string OrderId { get; set; }

        [Column("date_created")]
        public DateTime? DateCreated { get; set; }

        [Column("buyer")]
        public int? BuyerId { get; set; }

        [Column("seller")]
        public int? SellerId { get; set; }

        [StringLength(1000)]
        [Column("description")]
        public string Description { get; set; }

        [Column("status")]
        public int Status { get; set; } = 0;

        // Navigation properties

        [ForeignKey("BuyerId")]
        public User Buyer { get; set; }

        [ForeignKey("SellerId")]
        public User Seller { get; set; }

        [Column("payment_method_id")]
        [StringLength(25)]
        public string PaymentMethodId { get; set; } = "cod"; 

        [ForeignKey("PaymentMethodId")]
        public PaymentMethod PaymentMethod { get; set; }
        public ICollection<OrderDetail> OrderDetails { get; set; }
        public ICollection<Invoice> Invoices { get; set; }
        public ICollection<Shipment> Shipments { get; set; }
        public ICollection<ShipmentDetail> ShipmentDetails { get; set; }
    }

    [Table("order_d")]
    public class OrderDetail
    {
        [Key]
        [Column("order_id", Order = 0)]
        [StringLength(25)]
        public string OrderId { get; set; }

        [Key]
        [Column("product_id", Order = 1)]
        [StringLength(25)]
        public string ProductId { get; set; }

        [Key]
        [Column("pi_id", Order = 2)]
        [StringLength(25)]
        public string ProductInventoryId { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        [Column("cost")]
        public decimal Cost { get; set; }

        [Column("price")]
        public decimal Price { get; set; }
        [Column("price1")]
        public decimal Price1 { get; set; }

        [Column("price2")]
        public decimal Price2 { get; set; }

        // Navigation
        [ForeignKey("OrderId")]
        public Order Order { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }


        [ForeignKey("ProductInventoryId")]
        public ProductInventory ProductInventory { get; set; }
    }
}

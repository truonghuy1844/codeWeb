namespace ToyStore.Models
{
    public class OrderCheckoutDto
    {
        public int Buyer { get; set; }
        public int Seller { get; set; } = 1; // mặc định là hệ thống
        public string Description { get; set; } = "";
        public string AddressId { get; set; } = "";
        public List<OrderCheckoutItemDto> Items { get; set; } = new();
    }

    public class OrderCheckoutItemDto
    {
        public string ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Cost { get; set; }
        public decimal Price { get; set; }      // Giá thực thanh toán
      public decimal Price1 { get; set; }     // Giá gốc
       public decimal Price2 { get; set; }     // Giá đã giảm (nếu có)
    }
}
public class OrderDto
{
    public string OrderId { get; set; }
    public DateTime DateCreated { get; set; }
    public int Status { get; set; }
    public decimal TotalPrice { get; set; }
    public List<ProductDto> Products { get; set; }

    public DateTime OrderDate { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public string DeliveryAddress { get; set; }
    public string PaymentMethod { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public string ReceiverName { get; set; }
    public string ReceiverPhone { get; set; }
}
public class ProductDto
{
    public string ProductName { get; set; }
    public string Thumbnail { get; set; }
    public string Description { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }    // Giá thanh toán
    public decimal Price1 { get; set; }   // Giá gốc
    public decimal Price2 { get; set; }   // Giá đã giảm
}
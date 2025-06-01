// Models/OrderCheckoutDto.cs
using System.Collections.Generic;

namespace back_end.Models
{
    public class OrderCheckoutDto
    {
        public string? OrderId { get; set; }
        public int Buyer { get; set; }
        public int Seller { get; set; }
        public string? Description { get; set; }
        public int Status { get; set; }
        public List<OrderItemDto>? Items { get; set; }
    }
    
}

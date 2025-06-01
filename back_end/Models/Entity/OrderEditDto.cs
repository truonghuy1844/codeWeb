// back_end/Models/OrderEditDto.cs
using System;
using System.Collections.Generic;

namespace back_end.Models
{
    public class OrderEditDto
    {
        public string OrderId { get; set; } = string.Empty;
        public DateTime? DateCreated { get; set; }       // Hoặc DateOnly? nếu bạn chỉ dùng DateOnly
        public int Buyer { get; set; }                   // customerId
        public int Seller { get; set; }                  // employeeId
        public string? Description { get; set; }
        public int Status { get; set; }

        // Mảng các dòng chi tiết bên order_d
        public List<OrderDetailItem> Items { get; set; } = new List<OrderDetailItem>();
    }

    public class OrderDetailItem
    {
        public string ProductId { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Cost { get; set; }
        public decimal Price { get; set; }
        // Nếu cần thêm ô thuế, bạn có thể bổ sung: public string? Tax { get; set; }, etc.
    }
}

using System.Collections.Generic;

namespace back_end.Models
{

public class OrderItemDto
    {
        public string ProductId { get; set; } = null!;
        public string? PiId { get; set; }              // nếu client muốn chỉ định PiId; có thể để null để server tự lấy
        public int Quantity { get; set; }
        public decimal Cost { get; set; }
        public decimal Price { get; set; }
        public string? Tax { get; set; }
        public string? ProductInventoryId { get; set; }
    }
}
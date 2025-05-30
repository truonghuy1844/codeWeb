namespace ToyStore.Models
{
    public class CartItemDto
    {
        public int UserId { get; set; }
        public string ProductId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal? Price1 { get; set; }
        public decimal? Price2 { get; set; }
        public string UrlImage { get; set; } = string.Empty;
        public string PiId { get; set; } = "pi-001";    
        public decimal Cost { get; set; } = 0;  
    }
}

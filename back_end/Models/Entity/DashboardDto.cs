// back_end/Models/Dto/DashboardDto.cs
namespace back_end.Models.Dto
{
    public class DashboardDto
    {
        public int TotalProducts { get; set; }
        public int TotalOrders { get; set; }
        public int OrdersPending { get; set; }
        public int OrdersInProgress { get; set; }
        public int OrdersCompleted { get; set; }
        public int TotalEmployees { get; set; }
        public decimal TotalRevenue {get; set;}
    }
}



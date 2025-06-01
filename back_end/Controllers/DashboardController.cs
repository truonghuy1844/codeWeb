// back_end/Controllers/DashboardController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back_end.Models;
using back_end.Models.Dto;
using System.Linq;
using System.Threading.Tasks;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly WebCodeContext _context;

        public DashboardController(WebCodeContext context)
        {
            _context = context;
        }

        [HttpGet("metrics")]
        public async Task<IActionResult> GetDashboardMetrics()
        {
            int totalProducts = await _context.Products.CountAsync();
            int totalOrders = await _context.OrderTbs.CountAsync();
            int totalEmployees = await _context.Users.Where(u => u.IsSeller && u.IsAdmin).CountAsync();

            int ordersPending = await _context.OrderTbs.Where(o => o.Status == 0).CountAsync();
            int ordersInProgress = await _context.OrderTbs.Where(o => o.Status == 1).CountAsync();
            int ordersCompleted = await _context.OrderTbs.Where(o => o.Status == 2).CountAsync();

            var dto = new DashboardDto
            {
                TotalProducts = totalProducts,
                TotalOrders = totalOrders,
                OrdersPending = ordersPending,
                OrdersInProgress = ordersInProgress,
                OrdersCompleted = ordersCompleted,
                TotalEmployees = totalEmployees
            };

            return Ok(dto);
        }
    }
}
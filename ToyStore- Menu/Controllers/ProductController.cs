using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToyStore.Models;
namespace ToyStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/product
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                var count = await _context.Products.CountAsync();

                var products = await _context.Products
                    .Select(p => new {
                        p.ProductId,
                        p.Name,
                        p.Price1,
                        p.UrlImage1
                    })
                    .ToListAsync();

                return Ok(new { count, data = products });
            }
            catch (Exception ex)
            {
                Console.WriteLine("💥 Lỗi từ API:");
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Lỗi API: " + ex.Message);
            }
        }
        [HttpGet("highlight")]
        public async Task<IActionResult> GetHighlightProducts()
        {
            var products = await _context.Products
                .Where(p => p.Status == true)  // chỉ lấy sản phẩm đang hoạt động
                .OrderByDescending(p => p.Price1) // hoặc có thể theo số lượng mua nhiều nhất
                .Take(8) // Lấy top 8 nổi bật
                .ToListAsync();

            return Ok(products);
        }
        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts([FromQuery] string keyword)
        {
            try
            {
                var results = await _context.Products
                    .Where(p => p.Name.Contains(keyword) && p.Status == true)
                    .Select(p => new
                    {
                        p.ProductId,
                        p.Name,
                        p.Price1,
                        p.UrlImage1
                    })
                    .ToListAsync();

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi khi tìm kiếm: " + ex.Message);
            }
        }


    }




}

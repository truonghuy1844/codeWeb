using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back_end.Models.Entity;
using back_end.Models;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly WebCodeContext _context;

        public ProductController(WebCodeContext context)
        {
            _context = context;
        }

        //  API lấy toàn bộ sản phẩm: GET /api/product
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _context.Products
                .Include(p => p.Brand)
                .ToListAsync();

            return Ok(new
            {
                count = products.Count,
                data = products.Select(p => new
                {
                    p.ProductId,
                    p.Name,
                    p.Description,
                    p.Price1,
                    p.Price2, 
                    BrandName = p.Brand != null ? p.Brand.BrandName : null,
                    p.UrlImage1,
                    p.UrlImage2,
                    p.UrlImage3
                })
            });

        }

        // GET: api/product/highlight
        [HttpGet("highlight")]
        public async Task<IActionResult> GetHighlightProducts()
        {
            var products = await _context.OrderDs
                .GroupBy(od => od.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    TotalQuantity = g.Sum(x => x.Quantity)
                })
                .OrderByDescending(x => x.TotalQuantity)
                .Take(8)
                .Join(_context.Products,
                      g => g.ProductId,
                      p => p.ProductId,
                      (g, p) => new {
                          p.ProductId,
                          p.Name,
                          p.Price1,
                          p.Price2,
                          p.UrlImage1
                      })
                .Where(p => p.Price1 != null) // lọc an toàn
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
                        p.Price2,
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
        // ✅ API lấy 1 sản phẩm theo ID: GET /api/product/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(string id)
        {
            var product = await _context.Products
                .Include(p => p.Brand)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null)
                return NotFound();

            return Ok(new
            {
                product.ProductId,
                product.Name,
                product.Description,
                product.Price1,
                product.Price2,
                BrandName = product.Brand?.BrandName,
                product.UrlImage1,
                product.UrlImage2,
                product.UrlImage3
            });
        }
        // ✅ GET: api/product/filter?categoryName=...&minPrice=...&maxPrice=...&sort=...
        [HttpGet("filter")]
        public async Task<IActionResult> GetFilteredProducts(
            [FromQuery] string? categoryName,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? sort = "name_asc"
        )
        {
            try
            {
                var query = _context.Products
                    .Include(p => p.Category)
                    .Where(p => p.Status == true)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(categoryName))
                    query = query.Where(p => p.Category != null && p.Category.CategoryName.Contains(categoryName));

                if (minPrice.HasValue)
                    query = query.Where(p => p.Price1 >= minPrice.Value);
                if (maxPrice.HasValue)
                    query = query.Where(p => p.Price1 <= maxPrice.Value);

                query = sort switch
                {
                    "price_asc" => query.OrderBy(p => p.Price1),
                    "price_desc" => query.OrderByDescending(p => p.Price1),
                    "name_desc" => query.OrderByDescending(p => p.Name),
                    _ => query.OrderBy(p => p.Name)
                };

                var count = await query.CountAsync();

                var products = await query
                    .Select(p => new
                    {
                        p.ProductId,
                        p.Name,
                        p.Price1,
                        p.Price2,
                        p.UrlImage1,
                        CategoryName = p.Category != null ? p.Category.CategoryName : null
                    })
                    .ToListAsync();

                return Ok(new { count, data = products });
            }
            catch (Exception ex)
            {
                Console.WriteLine("💥 Lỗi khi lọc sản phẩm:");
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Lỗi API lọc sản phẩm: " + ex.Message);
            }
        }
    }
}

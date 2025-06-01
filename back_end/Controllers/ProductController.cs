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
        _context = context; // Gán qua constructor
    }

        //  API lấy toàn bộ sản phẩm: GET /api/product
        [HttpGet("all_product")]
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
                .Where(p => p.Price1 != null)
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

// ✅ GET: api/product/filter.
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

                if (!string.IsNullOrWhiteSpace(categoryName))
                    query = query.Where(p => p.Category != null && 
                             !string.IsNullOrEmpty(p.Category.CategoryName) && 
                             p.Category.CategoryName.Contains(categoryName));

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


            // GET: api/Products
            [HttpGet()]
            public async Task<IActionResult> GetProducts()
            {
                try
                {
                    var products = await _context.Products
                        .Include(p => p.Category)
                        .Include(p => p.Brand)
                        .Select(p => new
                        {
                            productId = p.ProductId,
                            name = p.Name,
                            name2 = p.Name2,
                            categoryID = p.CategoryId,
                            categoryName = p.Category != null ? p.Category.CategoryName : "Unknown",
                            brandID = p.BrandId,
                            brandName = p.Brand != null ? p.Brand.BrandName : "Unknown",
                            uom = p.Uom,
                            price1 = p.Price1,
                            dateApply1 = p.DateApply1,
                            price2 = p.Price2,       // sửa lại đúng trường
                            dateApply2 = p.DateApply2,
                            description = p.Description,
                            urlImage1 = p.UrlImage1,
                            urlImage2 = p.UrlImage2,
                            urlImage3 = p.UrlImage3,
                            status = p.Status
                        })
                        .ToListAsync();

                    return Ok(new { success = true, data = products });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new
                    {
                        success = false,
                        message = "Lỗi khi tải sản phẩm",
                        error = ex.Message
                    });
                }
            }
        }
        // [Route("api/[controller]")]
        // [ApiController]
        // public class ProductsController : ControllerBase
        // {
      

            
        //     // GET: api/Products
        //     [HttpGet]
        //     public async Task<IActionResult> GetProducts()
        //     {
        //         try
        //         {
        //             var products = await _context.Products
        //                 .Include(p => p.Category)
        //                 .Include(p => p.Brand)
        //                 .Select(p => new
        //                 {
        //                     productId = p.ProductId,
        //                     name = p.Name,
        //                     name2 = p.Name2,
        //                     categoryID = p.CategoryId,
        //                     categoryName = p.Category != null ? p.Category.CategoryName : "Unknown",
        //                     brandID = p.BrandId,
        //                     brandName = p.Brand != null ? p.Brand.BrandName : "Unknown",
        //                     uom = p.Uom,
        //                     price1 = p.Price1,
        //                     dateApply1 = p.DateApply1,
        //                     price2 = p.Price2,       // sửa lại đúng trường
        //                     dateApply2 = p.DateApply2,
        //                     description = p.Description,
        //                     urlImage1 = p.UrlImage1,
        //                     urlImage2 = p.UrlImage2,
        //                     urlImage3 = p.UrlImage3,
        //                     status = p.Status
        //                 })
        //                 .ToListAsync();

        //             return Ok(new { success = true, data = products });
        //         }
        //         catch (Exception ex)
        //         {
        //             return StatusCode(500, new
        //             {
        //                 success = false,
        //                 message = "Lỗi khi tải sản phẩm",
        //                 error = ex.Message
        //             });
        //         }
        //     }

        //     // GET: api/Products/{id}
        //     [HttpGet("{id}")]
        //     public async Task<IActionResult> GetProduct(string id)
        //     {
        //         try
        //         {
        //             var product = await _context.Products
        //                 .Include(p => p.Category)
        //                 .Include(p => p.Brand)
        //                 .Where(p => p.ProductId == id)
        //                 .Select(p => new
        //                 {
        //                     productId = p.ProductId,
        //                     name = p.Name,
        //                     name2 = p.Name2,
        //                     categoryID = p.CategoryId,
        //                     categoryName = p.Category != null ? p.Category.CategoryName : "Unknown",
        //                     brandID = p.BrandId,
        //                     brandName = p.Brand != null ? p.Brand.BrandName : "Unknown",
        //                     uom = p.Uom,
        //                     price1 = p.Price1,
        //                     dateApply1 = p.DateApply1,
        //                     price2 = p.Price2,
        //                     dateApply2 = p.DateApply2,
        //                     description = p.Description,
        //                     urlImage1 = p.UrlImage1,
        //                     urlImage2 = p.UrlImage2,
        //                     urlImage3 = p.UrlImage3,
        //                     status = p.Status
        //                 })
        //                 .FirstOrDefaultAsync();

        //             if (product == null)
        //             {
        //                 return NotFound(new { success = false, message = "Sản phẩm không tồn tại" });
        //             }

        //             return Ok(new { success = true, data = product });
        //         }
        //         catch (Exception ex)
        //         {
        //             return StatusCode(500, new
        //             {
        //                 success = false,
        //                 message = "Lỗi khi tải sản phẩm",
        //                 error = ex.Message
        //             });
        //         }
        //     }

        //     // Các API khác như POST, PUT, DELETE... tương tự
        // }

        // // ─────────── BẮT ĐẦU ĐOẠN CODE MỚI ───────────

        // // GET: api/product/fororder/{id}
        // // – Mục đích: Khi user nhập "Mã sản phẩm" trong OrderForm, 
        // //   front-end sẽ gọi endpoint này để lấy nhanh { name, uom, price } của sản phẩm.
        
        // ─────────── KẾT THÚC ĐOẠN CODE MỚI ───────────

        // GET: api/product/filter?categoryName=...&minPrice=...&maxPrice=...&sort=...
       
    // }
}

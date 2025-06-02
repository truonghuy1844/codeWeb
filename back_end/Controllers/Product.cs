// Controllers/ProductsController.cs
using Microsoft.AspNetCore.Mvc;
using back_end.Models;
using System.Data;
using back_end.Models.Entity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly WebCodeContext _context;

        public ProductsController(WebCodeContext context)
        {
            _context = context;
        }

        // GET: api/Products
           // GET: api/Products
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.Category)
                    .Include(p => p.Brand)
                    .Include(p => p.ProductIns)
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
                        price2 = p.Price2,
                        dateApply1 = p.DateApply1,
                        dateApply2 = p.DateApply2,
                        description = p.Description,
                        urlImage1 = p.UrlImage1,
                        urlImage2 = p.UrlImage2,
                        urlImage3 = p.UrlImage3,
                        quantity = p.ProductIns.Sum(pi => pi.Quantity),
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


        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(string id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .Include(p => p.Brand)
                    .Where(p => p.ProductId == id)
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
                        price2 = p.Price2,
                        dateApply2 = p.DateApply2,
                        description = p.Description,
                        urlImage1 = p.UrlImage1,
                        urlImage2 = p.UrlImage2,
                        urlImage3 = p.UrlImage3,
                        status = p.Status
                    })
                    .FirstOrDefaultAsync();

                if (product == null)
                    return NotFound(new { success = false, message = "Sản phẩm không tồn tại" });

                return Ok(new { success = true, data = product });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi truy vấn sản phẩm",
                    error = ex.Message
                });
            }
        }

        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, product);
        }

        [HttpPost("upsert")] //Admin nha
        public async Task<IActionResult> UpsertProduct([FromBody] ProductUpsertDto productDto)
        {
            try
            {
                // Log received data
                Console.WriteLine($"=== UPSERT PRODUCT START ===");
                Console.WriteLine($"ProductId: {productDto.ProductId}");
                Console.WriteLine($"Name: {productDto.Name}");
                Console.WriteLine($"CategoryId: {productDto.CategoryId}");
                Console.WriteLine($"UserId: {productDto.UserId}");

                // Validate input
                if (string.IsNullOrEmpty(productDto.ProductId) || string.IsNullOrEmpty(productDto.Name) ||
                    string.IsNullOrEmpty(productDto.CategoryId) || string.IsNullOrEmpty(productDto.UserId))
                {
                    Console.WriteLine("Validation failed: Missing required fields");
                    return BadRequest(new
                    {
                        success = false,
                        message = "Các trường bắt buộc không được để trống",
                        details = new
                        {
                            productId = string.IsNullOrEmpty(productDto.ProductId),
                            name = string.IsNullOrEmpty(productDto.Name),
                            categoryId = string.IsNullOrEmpty(productDto.CategoryId),
                            userId = string.IsNullOrEmpty(productDto.UserId)
                        }
                    });
                }

                // Check if stored procedure exists
                var spExists = await _context.Database.SqlQueryRaw<int>(
                    "SELECT COUNT(*) as Value FROM sys.objects WHERE name = 'upsert_product' AND type = 'P'"
                ).FirstOrDefaultAsync();

                if (spExists == 0)
                {
                    Console.WriteLine("ERROR: Stored procedure 'upsert_product' not found");
                    return StatusCode(500, new
                    {
                        success = false,
                        message = "Stored procedure không tồn tại"
                    });
                }

                Console.WriteLine("Stored procedure exists, creating parameters...");

                // Tạo parameters cho stored procedure
                var parameters = new[]
                {
                    new SqlParameter("@product_id", SqlDbType.VarChar, 25) { Value = productDto.ProductId },
                    new SqlParameter("@name", SqlDbType.NVarChar, 75) { Value = productDto.Name },
                    new SqlParameter("@name2", SqlDbType.NVarChar, 75) { Value = (object)productDto.Name2 ?? DBNull.Value },
                    new SqlParameter("@description", SqlDbType.NVarChar, 1000) { Value = (object)productDto.Description ?? DBNull.Value },
                    new SqlParameter("@brand_id", SqlDbType.VarChar, 25) { Value = (object)productDto.BrandId ?? DBNull.Value },
                    new SqlParameter("@category_id", SqlDbType.VarChar, 25) { Value = productDto.CategoryId },
                    new SqlParameter("@group_tb_1", SqlDbType.VarChar, 25) { Value = (object)productDto.GroupTb1 ?? DBNull.Value },
                    new SqlParameter("@group_tb_2", SqlDbType.VarChar, 25) { Value = (object)productDto.GroupTb2 ?? DBNull.Value },
                    new SqlParameter("@group_tb_3", SqlDbType.VarChar, 25) { Value = (object)productDto.GroupTb3 ?? DBNull.Value },
                    new SqlParameter("@group_tb_4", SqlDbType.VarChar, 25) { Value = (object)productDto.GroupTb4 ?? DBNull.Value },
                    new SqlParameter("@uom", SqlDbType.NVarChar, 20) { Value = (object)productDto.Uom ?? DBNull.Value },
                    new SqlParameter("@price1", SqlDbType.Money) { Value = (object)productDto.Price1 ?? DBNull.Value },
                    new SqlParameter("@date_apply1", SqlDbType.DateTime) { Value = (object)productDto.DateApply1 ?? DBNull.Value },
                    new SqlParameter("@price2", SqlDbType.Money) { Value = (object)productDto.Price2 ?? DBNull.Value },
                    new SqlParameter("@date_apply2", SqlDbType.DateTime) { Value = (object)productDto.DateApply2 ?? DBNull.Value },
                    new SqlParameter("@url_image1", SqlDbType.VarChar, 300) { Value = (object)productDto.UrlImage1 ?? DBNull.Value },
                    new SqlParameter("@url_image2", SqlDbType.VarChar, 300) { Value = (object)productDto.UrlImage2 ?? DBNull.Value },
                    new SqlParameter("@url_image3", SqlDbType.VarChar, 300) { Value = (object)productDto.UrlImage3 ?? DBNull.Value },
                    new SqlParameter("@user_id", SqlDbType.VarChar, 25) { Value = productDto.UserId },
                    new SqlParameter("@status", SqlDbType.Bit) { Value = productDto.Status }
                };

                Console.WriteLine("Parameters created, executing stored procedure...");

                // Thực thi stored procedure
                await _context.Database.ExecuteSqlRawAsync("EXEC upsert_product " +
                    "@product_id, @name, @name2, @description, @brand_id, @category_id, " +
                    "@group_tb_1, @group_tb_2, @group_tb_3, @group_tb_4, @uom, " +
                    "@price1, @date_apply1, @price2, @date_apply2, " +
                    "@url_image1, @url_image2, @url_image3, @user_id, @status", parameters);

                Console.WriteLine("Stored procedure executed successfully");

                return Ok(new
                {
                    success = true,
                    message = "Xử lý sản phẩm thành công",
                    productId = productDto.ProductId
                });
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"=== SQL EXCEPTION ===");
                Console.WriteLine($"Error Number: {ex.Number}");
                Console.WriteLine($"Severity: {ex.Class}");
                Console.WriteLine($"State: {ex.State}");
                Console.WriteLine($"Procedure: {ex.Procedure}");
                Console.WriteLine($"Line Number: {ex.LineNumber}");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                // Xử lý các lỗi SQL cụ thể
                string errorMessage = "Lỗi cơ sở dữ liệu";

                switch (ex.Number)
                {
                    case 2: // Could not find stored procedure
                        errorMessage = "Stored procedure không tồn tại";
                        break;
                    case 515: // Cannot insert NULL value
                        errorMessage = "Thiếu dữ liệu bắt buộc";
                        break;
                    case 547: // Foreign key constraint violation
                        errorMessage = "Dữ liệu tham chiếu không hợp lệ (CategoryId hoặc BrandId không tồn tại)";
                        break;
                    case 2627: // Primary key violation
                        errorMessage = "Mã sản phẩm đã tồn tại";
                        break;
                    case 8152: // String or binary data would be truncated
                        errorMessage = "Dữ liệu quá dài cho trường cho phép";
                        break;
                    default:
                        if (ex.Message.Contains("Bạn không phải người bán"))
                        {
                            errorMessage = "Bạn không có quyền thực hiện thao tác này";
                        }
                        else
                        {
                            errorMessage = ex.Message;
                        }
                        break;
                }

                return StatusCode(500, new
                {
                    success = false,
                    message = errorMessage,
                    sqlError = ex.Number,
                    details = ex.Message
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"=== GENERAL EXCEPTION ===");
                Console.WriteLine($"Type: {ex.GetType().Name}");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                return StatusCode(500, new
                {
                    success = false,
                    message = "Có lỗi xảy ra",
                    error = ex.Message,
                    type = ex.GetType().Name
                });
            }
        }


        // DELETE: api/Products/id
        [HttpDelete("{id}")] //Admin nha
        public async Task<IActionResult> DeleteProduct(string id)
        {
            try
            {
                Console.WriteLine($"Deleting product ID: {id}");

                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest(new { success = false, message = "Mã sản phẩm không hợp lệ" });
                }

                // Kiểm tra sản phẩm có tồn tại không
                var productExists = await _context.Database
                    .SqlQueryRaw<int>("SELECT COUNT(*) as Value FROM product WHERE product_id = {0}", id)
                    .FirstOrDefaultAsync();

                if (productExists == 0)
                {
                    return NotFound(new { success = false, message = "Sản phẩm không tồn tại" });
                }

                // Xóa trực tiếp bằng SQL
                var rowsAffected = await _context.Database
                    .ExecuteSqlRawAsync("DELETE FROM product WHERE product_id = {0}", id);

                Console.WriteLine($"Rows affected: {rowsAffected}");

                if (rowsAffected > 0)
                {
                    return Ok(new { success = true, message = "Xóa sản phẩm thành công" });
                }
                else
                {
                    return BadRequest(new { success = false, message = "Không thể xóa sản phẩm" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Delete error: {ex.Message}");
                Console.WriteLine($"Inner error: {ex.InnerException?.Message}");

                return StatusCode(500, new
                {
                    success = false,
                    message = "Có lỗi xảy ra khi xóa sản phẩm",
                    error = ex.Message
                });
            }
        }
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
                    query = query.Where(p => p.Category != null
                                             && p.Category.CategoryName.Contains(categoryName));

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
        [HttpGet("fororder/{id}")]
        public async Task<IActionResult> GetProductForOrder(string id)
        {
            // 1) Tìm product (chỉ load đúng record cần thiết)
            var product = await _context.Products
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null)
            {
                return NotFound(new 
                {
                    success = false,
                    message = $"Không tìm thấy sản phẩm với ID = {id}"
                });
            }

            // 2) Trả về chỉ các trường React (OrderForm.jsx) cần:
            var result = new
            {
                name  = product.Name ?? string.Empty,
                uom   = product.Uom  ?? string.Empty,        // trường "Uom" trong entity
                price = product.Price1.HasValue 
                        ? product.Price1.Value 
                        : 0m
            };

            return Ok(new 
            { 
                success = true, 
                data    = result 
            });
        }
    }
}

// DTO class để nhận dữ liệu từ frontend
public class ProductUpsertDto //Admin nha
{
    public string ProductId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Name2 { get; set; }
    public string? Description { get; set; }
    public string? BrandId { get; set; }
    public string CategoryId { get; set; } = string.Empty;
    public string? GroupTb1 { get; set; }
    public string? GroupTb2 { get; set; }
    public string? GroupTb3 { get; set; }
    public string? GroupTb4 { get; set; }
    public string? Uom { get; set; }
    public decimal? Price1 { get; set; }
    public DateTime? DateApply1 { get; set; }
    public decimal? Price2 { get; set; }
    public DateTime? DateApply2 { get; set; }
    public string? UrlImage1 { get; set; }
    public string? UrlImage2 { get; set; }
    public string? UrlImage3 { get; set; }
    public string UserId { get; set; } = string.Empty;
    public bool Status { get; set; } = true;
}

// Response DTO
public class ApiResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }
    public string? Error { get; set; }
}


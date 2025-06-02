using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Collections.Generic;
using back_end.Models.Entity;
using Microsoft.EntityFrameworkCore;
using back_end.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using ItemDTO = back_end.Models.OrderItemDto;
using CheckoutDto = back_end.Models.Entity.OrderCheckoutDto;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminOrderController : ControllerBase
    {
        private readonly WebCodeContext _context;

        public AdminOrderController(WebCodeContext context)
        {
            _context = context;
        }

        // 1. GET ALL: GET /api/AdminOrder/get-all
        //──────────────────────────────────────────────────────────────
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllOrders()
        {
            // 1.1. Lấy về danh sách, sắp xếp theo DateCreated tại tầng EF Core
            var rawList = await _context.OrderTbs
                .OrderByDescending(o => o.DateCreated)    // sắp xếp theo DateOnly? trực tiếpAdd commentMore actions
                .Select(o => new
                {
                    o.OrderId,
                    o.DateCreated,
                    o.Buyer,
                    o.Seller,
                    o.Description,
                    o.Status
                })
                .AsNoTracking()
                .ToListAsync();

            // 1.2. Chuyển đổi DateCreated sang string "yyyy-MM-dd" trên bộ nhớ (client)
            var result = rawList.Select(o => new
            {
                o.OrderId,
                DateCreated = o.DateCreated.HasValue
                    ? o.DateCreated.Value.ToString("yyyy-MM-dd")
                    : "",
                o.Buyer,
                o.Seller,
                o.Description,
                o.Status
            });

            return Ok(result);
        }

        //──────────────────────────────────────────────────────────────
        // 2. GET BY ID: GET /api/AdminOrder/{orderId}
        //──────────────────────────────────────────────────────────────
        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById(string orderId)
        {
            if (string.IsNullOrWhiteSpace(orderId))
                return BadRequest(new { message = "OrderId không được để trống." });

            var order = await _context.OrderTbs
                .Include(o => o.OrderDs)
                .Where(o => o.OrderId == orderId)
                .Select(o => new
                {
                    o.OrderId,
                    DateCreated = o.DateCreated.HasValue
                        ? o.DateCreated.Value.ToString("yyyy-MM-dd")
                        : "",
                    Buyer = o.Buyer,
                    Seller = o.Seller,
                    o.Description,
                    o.Status,
                    Items = o.OrderDs.Select(d => new
                    {
                        d.ProductId,
                        d.PiId,
                        d.Quantity,
                        d.Cost,
                        d.Price,
                        TaxPct = d.Tax != null ? decimal.Parse(d.Tax) : 0m,
                        TaxAmt = d.Tax != null
                            ? Math.Round((d.Quantity ?? 0) * (d.Price ?? 0) * decimal.Parse(d.Tax) / 100, 2)
                            : 0m
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (order == null)
                return NotFound(new { message = $"Không tìm thấy Order với ID = {orderId}" });

            return Ok(order);
        }

        //──────────────────────────────────────────────────────────────
        // 3. CREATE: POST /api/AdminOrder/create
        //──────────────────────────────────────────────────────────────
        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder2([FromBody] CheckoutDto orderDto)
        {

            if (orderDto == null || orderDto.Items == null || !orderDto.Items.Any())
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ." });


            if (orderDto.Buyer <= 0 || orderDto.Seller <= 0)
                return BadRequest(new { message = "Buyer và Seller phải > 0." });

            var newOrderId = !string.IsNullOrWhiteSpace(orderDto.OrderId)
                ? orderDto.OrderId.Trim()
                : $"od_{Guid.NewGuid():N}".Substring(0, 16);

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Tạo OrderTb
                var orderEntity = new OrderTb
                {
                    OrderId = newOrderId,
                    DateCreated = DateOnly.FromDateTime(DateTime.Now),
                    Buyer = orderDto.Buyer,
                    Seller = orderDto.Seller,
                    Description = orderDto.Description,
                    Status = orderDto.Status
                };
                _context.OrderTbs.Add(orderEntity);
                await _context.SaveChangesAsync();

                // Tạo OrderD cho từng item
                foreach (var item in orderDto.Items)
                {
                    if (string.IsNullOrWhiteSpace(item.ProductId))
                        throw new Exception("ProductId không được để trống.");

                    // Lấy hoặc dùng PiId từ DTO; ở đây giả sử tìm PiId mới nhất
                    var latestPi = await _context.ProductIns
                        .Where(pi => pi.ProductId == item.ProductId)
                        .OrderByDescending(pi => pi.DateCreated)
                        .FirstOrDefaultAsync();
                    if (latestPi == null)
                        throw new Exception($"Không tìm thấy ProductIn cho ProductId = '{item.ProductId}'.");

                    var odEntity = new OrderD
                    {
                        OrderId = newOrderId,
                        ProductId = item.ProductId,
                        PiId = latestPi.PiId,
                        Quantity = item.Quantity,
                        Cost = item.Cost,
                        Price = item.Price,
                        Tax = null  // hoặc gán null nếu item.Tax cũng null
                    };
                    _context.OrderDs.Add(odEntity);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok(new
                {
                    success = true,
                    message = "Tạo đơn hàng thành công.",
                    orderId = newOrderId
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new
                {
                    success = false,
                    message = $"Lỗi khi tạo đơn hàng: {ex.Message}"
                });
            }
        }

        //──────────────────────────────────────────────────────────────
        // 4. UPDATE: PUT /api/AdminOrder/update/{orderId}
        //──────────────────────────────────────────────────────────────
        [HttpPut("update/{orderId}")]
        public async Task<IActionResult> UpdateOrder2(
            [FromRoute] string orderId,
            [FromBody] CheckoutDto orderDto)
        {
            // 1. Kiểm tra đầu vào
            if (string.IsNullOrWhiteSpace(orderId))
                return BadRequest(new { message = "orderId không được để trống." });
                if (orderDto == null || orderDto.Items == null || !orderDto.Items.Any())
                return BadRequest(new { message = "Danh sách Items không hợp lệ." });

            // 2. Tìm order header (bao gồm cả các OrderDs) trong database
            var existingOrder = await _context.OrderTbs
                .Include(o => o.OrderDs)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (existingOrder == null)
                return NotFound(new { message = $"Không tìm thấy Order với ID = {orderId}" });

            // 3. Cập nhật các trường header
            existingOrder.Buyer       = orderDto.Buyer;
            existingOrder.Seller      = orderDto.Seller;
            existingOrder.Description = orderDto.Description;
            existingOrder.Status      = orderDto.Status;
            // Nếu bạn muốn cập nhật ngày sửa (nếu có cột DateModified), có thể làm ở đây.
            // existingOrder.DateCreated = DateOnly.FromDateTime(DateTime.Now); // hoặc không thay đổi phần ngày

            // 4. Xóa toàn bộ OrderDs cũ
            _context.OrderDs.RemoveRange(existingOrder.OrderDs);

            // 5. Tạo lại các dòng chi tiết mới (OrderD) theo Items trong DTO
            var newOrderDetails = new List<OrderD>();
            foreach (var item in orderDto.Items)
            {
                // 5.1 Lấy PiId mới nhất từ ProductIn (có thể null nếu không tìm thấy)
                var latestPi = await _context.ProductIns
                    .Where(pi => pi.ProductId == item.ProductId)
                    .OrderByDescending(pi => pi.DateCreated)
                    .FirstOrDefaultAsync();

                if (latestPi == null)
                {
                    return BadRequest(new
                    {
                        message = $"Không tìm thấy record trong product_in cho ProductId = {item.ProductId}"
                    });
                }
                // 5.2 Tạo đối tượng OrderD mới
                var od = new OrderD
                {
                    OrderId   = orderId,
                    ProductId = item.ProductId,
                    PiId      = latestPi.PiId,
                    Quantity  = item.Quantity,
                    Cost      = item.Cost,
                    Price     = item.Price,
                };
                newOrderDetails.Add(od);
            }

            // 6. Thêm các dòng OrderD mới vào DbContext
            await _context.OrderDs.AddRangeAsync(newOrderDetails);


            // 7. Lưu tất cả thay đổi
            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Cập nhật đơn hàng thành công." });
            }
            catch (DbUpdateException dbEx)
            {
                // Bắt lỗi database (ví dụ: ràng buộc FOREIGN KEY, trigger, v.v)
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi cập nhật đơn hàng: " + dbEx.InnerException?.Message
                });
            }
        }
        //──────────────────────────────────────────────────────────────
        // 5. DELETE: DELETE /api/AdminOrder/delete/{orderId}
        //──────────────────────────────────────────────────────────────
        [HttpDelete("delete/{orderId}")]
        public async Task<IActionResult> DeleteOrder(string orderId)
        {
            if (string.IsNullOrWhiteSpace(orderId))
                return BadRequest(new { message = "OrderId không được để trống." });
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var existingOrder = await _context.OrderTbs
                    .Include(o => o.OrderDs)
                    .FirstOrDefaultAsync(o => o.OrderId == orderId);
                if (existingOrder == null)
                    return NotFound(new { message = $"Không tìm thấy Order với ID = {orderId}" });
                // Xóa hết OrderDs
                if (existingOrder.OrderDs.Any())
                {
                    _context.OrderDs.RemoveRange(existingOrder.OrderDs);
                    await _context.SaveChangesAsync();
                }
                // Xóa OrderTb
                _context.OrderTbs.Remove(existingOrder);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return Ok(new
                {
                    success = true,
                    message = $"Xóa đơn hàng {orderId} thành công."
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi xóa đơn hàng: " + ex.Message
                });
            }
        }
    }
}
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
    public class OrdersController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly WebCodeContext _context;
        public OrdersController(IConfiguration config, WebCodeContext context)
        {
            _config = config;
            _context = context;
        }

        [HttpGet]
        public IActionResult GetOrders([FromQuery] int buyerId)
        {
            var orders = new List<OrderDto>();
            var orderMap = new Dictionary<string, OrderDto>();
            using (var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                conn.Open();
                using var orderCmd = new SqlCommand(@"
                    SELECT o.order_id, o.date_created, o.status, i.amount_payable
                    FROM order_tb o
                    LEFT JOIN invoice i ON o.order_id = i.order_id
                    WHERE o.buyer = @buyerId
                    ORDER BY o.date_created DESC
                ", conn);
                orderCmd.Parameters.AddWithValue("@buyerId", buyerId);
                using var reader = orderCmd.ExecuteReader();
                while (reader.Read())
                {
                    var order = new OrderDto
                    {
                        OrderId = reader.GetString(0),
                        DateCreated = reader.GetDateTime(1),
                        Status = reader.GetInt32(2),
                        Products = new List<ProductDto>()
                    };
                    decimal? dbTotal = reader.IsDBNull(3) ? (decimal?)null : reader.GetDecimal(3);
                    order.TotalPrice = dbTotal ?? 0;
                    orders.Add(order);
                    orderMap[order.OrderId] = order;
                }
                reader.Close();
                using var detailCmd = new SqlCommand(@"
                    SELECT od.order_id, p.name, p.url_image1, p.description, od.quantity,
                           p.price1, p.price2, od.price
                    FROM order_d od
                    JOIN product p ON od.product_id = p.product_id
                    WHERE od.order_id IN (SELECT order_id FROM order_tb WHERE buyer = @buyerId)
                ", conn);
                detailCmd.Parameters.AddWithValue("@buyerId", buyerId);

                using var detailReader = detailCmd.ExecuteReader();
                while (detailReader.Read())
                {
                    var orderId = detailReader.GetString(0);
                    if (!orderMap.ContainsKey(orderId)) continue;
                    var product = new ProductDto
                    {
                        ProductName = detailReader.GetString(1),
                        Thumbnail = detailReader.GetString(2),
                        Description = detailReader.IsDBNull(3) ? "" : detailReader.GetString(3),
                        Quantity = detailReader.GetInt32(4),
                        Price1 = detailReader.GetDecimal(5),
                        Price2 = detailReader.IsDBNull(6) ? 0 : detailReader.GetDecimal(6),
                        Price = detailReader.GetDecimal(7)
                    };
                    orderMap[orderId].Products.Add(product);
                }
                detailReader.Close();
                foreach (var o in orders)
                {
                    o.TotalPrice = o.Products.Sum(p => p.Price * p.Quantity);
                }
                var result = orders.Select(o => new
                {
                    o.OrderId,
                    o.DateCreated,
                    o.Status,
                    o.Products,
                    TotalPrice = o.TotalPrice,
                    ShippingFee = o.TotalPrice >= 500000 ? 0 : 30000,
                    TotalPay = o.TotalPrice + (o.TotalPrice >= 500000 ? 0 : 30000)
                });

                return Ok(result);
            }
        }
        [HttpGet("{orderId}")]
        public IActionResult GetOrderDetails(string orderId)
        {
            using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            conn.Open();
            var order = new OrderDto { OrderId = orderId, Products = new List<ProductDto>() };
            using (var cmd = new SqlCommand(@"
                SELECT 
                    o.status, 
                    o.date_created,
                    s.date_actual_deli,
                    ISNULL(s.name_receive, u.name),
                    ISNULL(s.phone_receive, u.phone_number),
                    CONCAT_WS(', ', a.detail, a.street, a.ward, a.district, a.city, a.country),
                    ISNULL(pm.name, '')
                FROM order_tb o
                LEFT JOIN shipment s ON o.order_id = s.order_id
                LEFT JOIN address a ON s.address_id = a.address_id
                LEFT JOIN invoice i ON o.order_id = i.order_id
                LEFT JOIN payment_method pm ON i.method = pm.method_id
                LEFT JOIN user_tb2 u ON o.buyer = u.user_id
                WHERE o.order_id = @orderId 
            ", conn))
            {
                cmd.Parameters.AddWithValue("@orderId", orderId);
                using var reader = cmd.ExecuteReader();
                if (!reader.Read())
                    return NotFound(new { message = "Không tìm thấy đơn hàng." });

                int field = 0;
                order.Status = reader.GetInt32(field++);
                order.OrderDate = reader.GetDateTime(field++);
                order.DeliveryDate = reader.IsDBNull(field) ? null : reader.GetDateTime(field); field++;
                order.ReceiverName = reader.IsDBNull(field) ? "" : reader.GetValue(field).ToString(); field++;
                order.ReceiverPhone = reader.IsDBNull(field) ? "" : reader.GetValue(field).ToString(); field++;
                order.DeliveryAddress = reader.IsDBNull(field) ? "" : reader.GetString(field); field++;
                order.PaymentMethod = reader.IsDBNull(field) ? "" : reader.GetString(field); field++;
            }
            using (var cmd = new SqlCommand(@"
               SELECT p.name, p.url_image1, p.description, od.quantity, 
                      ISNULL(p.price2, p.price1) AS price, p.price1, p.price2
                FROM order_d od
                JOIN product p ON od.product_id = p.product_id
                WHERE od.order_id = @orderId
            ", conn))
            {
                cmd.Parameters.AddWithValue("@orderId", orderId);
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    var product = new ProductDto
                    {
                        ProductName = reader.GetString(0),
                        Thumbnail = reader.GetString(1),
                        Description = reader.IsDBNull(2) ? "" : reader.GetString(2),
                        Quantity = reader.GetInt32(3),
                        Price = reader.GetDecimal(4),
                        Price1 = reader.GetDecimal(5),
                        Price2 = reader.IsDBNull(6) ? 0 : reader.GetDecimal(6)
                    };
                    order.Products.Add(product);
                }
            }
            order.TotalPrice = order.Products.Sum(p => p.Price * p.Quantity);
            var shippingFee = order.TotalPrice >= 500000 ? 0 : 30000;
            var totalPay = order.TotalPrice + shippingFee;
            return Ok(new
            {
                order.OrderId,
                order.Status,
                order.OrderDate,
                order.DeliveryDate,
                order.ReceiverName,
                order.ReceiverPhone,
                order.DeliveryAddress,
                order.PaymentMethod,
                order.Products,
                TotalPrice = order.TotalPrice,
                ShippingFee = shippingFee,
                TotalPay = totalPay
            });
        }

        [HttpPost("create")]
        public IActionResult CreateOrder([FromBody] CheckoutDto orderDto)
        {
            if (orderDto == null || orderDto.Items == null || !orderDto.Items.Any())
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ." });

            if (string.IsNullOrWhiteSpace(orderDto.AddressId))
                return BadRequest(new { message = "Thiếu mã địa chỉ giao hàng." });
            var orderId = $"od_{Guid.NewGuid().ToString("N").Substring(0, 16)}";
            var shipmentId = $"sh_{Guid.NewGuid().ToString("N").Substring(0, 16)}";

            using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            conn.Open();
            using var tran = conn.BeginTransaction();
            try
            {
                // 1. Thêm đơn hàng vào order_tb
                using (var cmd = new SqlCommand(@"
                    INSERT INTO order_tb (order_id, date_created, buyer, seller, description, status)
                    VALUES (@id, GETDATE(), @buyer, @seller, @desc, 0)", conn, tran))
                {
                    cmd.Parameters.AddWithValue("@id", orderId);
                    cmd.Parameters.AddWithValue("@buyer", orderDto.Buyer);
                    cmd.Parameters.AddWithValue("@seller", orderDto.Seller);
                    cmd.Parameters.AddWithValue("@desc", orderDto.Description ?? "");
                    cmd.ExecuteNonQuery();
                }
                // 2. Gắn địa chỉ vào shipment
                using (var cmd = new SqlCommand(@"
                    INSERT INTO shipment (shipment_id, order_id, address_id, status)
                    VALUES (@shId, @orderId, @addressId, 0)", conn, tran))
                {
                    cmd.Parameters.AddWithValue("@shId", shipmentId);
                    cmd.Parameters.AddWithValue("@orderId", orderId);
                    cmd.Parameters.AddWithValue("@addressId", orderDto.AddressId);
                    cmd.ExecuteNonQuery();
                }
                // 3. Thêm chi tiết đơn hàng
                foreach (var item in orderDto.Items)
                {
                    string piId = "";
                    using (var piCmd = new SqlCommand(@"
                        SELECT TOP 1 pi_id FROM product_in 
                        WHERE product_id = @productId 
                        ORDER BY date_created DESC", conn, tran))
                    {
                        piCmd.Parameters.AddWithValue("@productId", item.ProductId);
                        var result = piCmd.ExecuteScalar();

                        if (result != null)
                            piId = result.ToString();
                        else
                            return BadRequest(new { message = $"Không tìm thấy hàng tồn kho cho sản phẩm {item.ProductId}" });
                    }
                    using var cmd = new SqlCommand(@"
                        INSERT INTO order_d (order_id, product_id, pi_id, quantity, cost, price)
                        VALUES (@orderId, @productId, @piId, @quantity, @cost, @price)", conn, tran);
                    cmd.Parameters.AddWithValue("@orderId", orderId);
                    cmd.Parameters.AddWithValue("@productId", item.ProductId);
                    cmd.Parameters.AddWithValue("@piId", piId);
                    cmd.Parameters.AddWithValue("@quantity", item.Quantity);
                    cmd.Parameters.AddWithValue("@cost", item.Cost);
                    cmd.Parameters.AddWithValue("@price", item.Price);
                    cmd.ExecuteNonQuery();
                }
                tran.Commit();
                return Ok(new { success = true, message = "Đơn hàng đã được tạo.", orderId });
            }
            catch (Exception ex)
            {
                tran.Rollback();
                return StatusCode(500, new { success = false, message = ex.Message });

            }
        }

        // 1. GET ALL: GET /api/Orders/get-all
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
        // 2. GET BY ID: GET /api/Orders/{orderId}
        //──────────────────────────────────────────────────────────────
        [HttpGet("{orderId}2")]
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
        // 3. CREATE: POST /api/Orders/create
        //──────────────────────────────────────────────────────────────
        [HttpPost("create2")]
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
        // 4. UPDATE: PUT /api/Orders/update/{orderId}
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
        // 5. DELETE: DELETE /api/Orders/delete/{orderId}
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

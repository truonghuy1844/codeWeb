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
        public IActionResult GetOrders(int buyerId)
        {
            try
            {
                Console.WriteLine($"[DEBUG] Getting orders for buyerId = {buyerId}");

                var orders = new List<OrderDto>();
                var orderMap = new Dictionary<string, OrderDto>();

                using (var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
                {
                    conn.Open();

                    // 1. Lấy danh sách đơn hàng
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
                            OrderId = reader.IsDBNull(0) ? "" : reader.GetString(0),
                            DateCreated = reader.IsDBNull(1) ? DateTime.MinValue : reader.GetDateTime(1),
                            Status = reader.IsDBNull(2) ? 0 : reader.GetInt32(2),
                            Products = new List<ProductDto>()
                        };

                        decimal? dbTotal = reader.IsDBNull(3) ? (decimal?)null : reader.GetDecimal(3);
                        order.TotalPrice = dbTotal ?? 0;

                        orders.Add(order);
                        orderMap[order.OrderId] = order;
                    }

                    reader.Close();

                    // Nếu không có đơn hàng thì trả về mảng rỗng
                    if (!orders.Any())
                    {
                        return Ok(new List<object>());
                    }

                    // 2. Lấy chi tiết sản phẩm
                    using var detailCmd = new SqlCommand(@"
                SELECT od.order_id, p.name, p.url_image1, p.description, od.quantity, ISNULL(p.price2, p.price1) AS price
                FROM order_d od
                JOIN product p ON od.product_id = p.product_id
                WHERE od.order_id IN (
                    SELECT order_id FROM order_tb WHERE buyer = @buyerId
                )
            ", conn);
                    detailCmd.Parameters.AddWithValue("@buyerId", buyerId);

                    using var detailReader = detailCmd.ExecuteReader();
                    while (detailReader.Read())
                    {
                        var orderId = detailReader.GetString(0);
                        if (!orderMap.ContainsKey(orderId)) continue;

                        var product = new ProductDto
                        {
                            ProductName = detailReader.IsDBNull(1) ? "" : detailReader.GetString(1),
                            Thumbnail = detailReader.IsDBNull(2) ? "" : detailReader.GetString(2),
                            Description = detailReader.IsDBNull(3) ? "" : detailReader.GetString(3),
                            Quantity = detailReader.IsDBNull(4) ? 0 : detailReader.GetInt32(4),
                            Price = detailReader.IsDBNull(5) ? 0 : detailReader.GetDecimal(5),

                        };

                        orderMap[orderId].Products.Add(product);
                    }

                    detailReader.Close();

                    // 3. Cập nhật lại TotalPrice nếu cần
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
            catch (Exception ex)
            {
                Console.WriteLine("[ERROR] GetOrders failed: " + ex.Message);
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }
        [HttpGet("{orderId}")]
        public IActionResult GetOrderDetails(string orderId)
        {
            using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            conn.Open();

            var order = new OrderDto { OrderId = orderId, Products = new List<ProductDto>() };

            // 1. Lấy thông tin đơn hàng và địa chỉ nhận hàng
            string receiverName = "", receiverPhone = "", deliveryAddress = "", paymentMethod = "";
            DateTime? deliveryDate = null;
            int status = 0;
            DateTime orderDate = DateTime.MinValue;

            using (var cmd1 = new SqlCommand(@"
        SELECT 
            o.status, 
            o.date_created,
            s.date_actual_deli,
            ISNULL(s.name_receive, u.name),
            ISNULL(s.phone_receive, u.phone_number),
            ISNULL(CONCAT_WS(', ', a.detail, a.street, a.ward, a.district, a.city, a.country), ''),
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
                cmd1.Parameters.AddWithValue("@orderId", orderId);
                using var reader1 = cmd1.ExecuteReader();
                if (!reader1.Read())
                    return NotFound(new { message = "Không tìm thấy đơn hàng." });

                status = reader1.IsDBNull(0) ? 0 : reader1.GetInt32(0);
                orderDate = reader1.IsDBNull(1) ? DateTime.MinValue : reader1.GetDateTime(1);
                deliveryDate = reader1.IsDBNull(2) ? null : reader1.GetDateTime(2);
                receiverName = reader1.IsDBNull(3) ? "" : reader1.GetString(3);
                receiverPhone = reader1.IsDBNull(4) ? "" : reader1.GetString(4);
                deliveryAddress = reader1.IsDBNull(5) ? "" : reader1.GetString(5);
                paymentMethod = reader1.IsDBNull(6) ? "" : reader1.GetString(6);
            }

            // 2. Lấy danh sách sản phẩm trong đơn
            using (var cmd2 = new SqlCommand(@"
        SELECT p.name, p.url_image1, p.description, od.quantity, 
               ISNULL(p.price2, p.price1) AS price, p.price1, p.price2
        FROM order_d od
        JOIN product p ON od.product_id = p.product_id
        WHERE od.order_id = @orderId
    ", conn))
            {
                cmd2.Parameters.AddWithValue("@orderId", orderId);
                using var reader2 = cmd2.ExecuteReader();
                while (reader2.Read())
                {
                    var product = new ProductDto
                    {
                        ProductName = reader2.IsDBNull(0) ? "" : reader2.GetString(0),
                        Thumbnail = reader2.IsDBNull(1) ? "" : reader2.GetString(1),
                        Description = reader2.IsDBNull(2) ? "" : reader2.GetString(2),
                        Quantity = reader2.IsDBNull(3) ? 0 : reader2.GetInt32(3),
                        Price = reader2.IsDBNull(4) ? 0 : reader2.GetDecimal(4),
                        Price1 = reader2.IsDBNull(5) ? 0 : reader2.GetDecimal(5),
                        Price2 = reader2.IsDBNull(6) ? 0 : reader2.GetDecimal(6)
                    };
                    order.Products.Add(product);
                }
            }

            // 3. Tính tổng tiền
            order.Status = status;
            order.OrderDate = orderDate;
            order.DeliveryDate = deliveryDate;
            order.ReceiverName = receiverName;
            order.ReceiverPhone = receiverPhone;
            order.DeliveryAddress = deliveryAddress;
            order.PaymentMethod = paymentMethod;
            order.TotalPrice = order.Products.Sum(p => p.Price * p.Quantity);
            var shippingFee = order.TotalPrice >= 500000 ? 0 : 30000;
            var totalPay = order.TotalPrice + shippingFee;

            // 4. Trả về kết quả
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
    }
}

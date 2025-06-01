using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Collections.Generic;
using back_end.Models.Entity;
using Microsoft.EntityFrameworkCore;
using back_end.Models;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IConfiguration _config;

        public OrdersController(IConfiguration config)
        {
            _config = config;
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
        //CHI TIẾT ĐƠN MUA

        [HttpGet("{orderId}")]
        public IActionResult GetOrderDetails(string orderId)
        {
            using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection" +
                "" +
                "" +
                ""));
            conn.Open();

            var order = new OrderDto { OrderId = orderId, Products = new List<ProductDto>() };

            // 1. Thông tin cơ bản đơn hàng
            using (var cmd = new SqlCommand(@"
        SELECT 
            o.status, 
            o.date_created,
            s.date_actual_deli,
            ISNULL(s.name_receive, u.name) AS receiver_name,
            ISNULL(s.phone_receive, u.phone_number) AS receiver_phone,
            CONCAT_WS(', ', a.detail, a.street, a.ward, a.district, a.city, a.country) AS full_address,
            ISNULL(pm.name, '') AS payment_method
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
                order.Status = reader.IsDBNull(field) ? 0 : reader.GetInt32(field++);
                order.OrderDate = reader.IsDBNull(field) ? DateTime.MinValue : reader.GetDateTime(field++);
                order.DeliveryDate = reader.IsDBNull(field) ? null : reader.GetDateTime(field); field++;
                order.ReceiverName = reader.IsDBNull(field) ? "" : reader.GetString(field); field++;
                order.ReceiverPhone = reader.IsDBNull(field) ? "" : reader.GetString(field); field++;
                order.DeliveryAddress = reader.IsDBNull(field) ? "" : reader.GetString(field); field++;
                order.PaymentMethod = reader.IsDBNull(field) ? "" : reader.GetString(field); field++;

            }

            // 2. Danh sách sản phẩm trong đơn
            using (var cmd = new SqlCommand(@"
        SELECT p.name, p.url_image1, p.description, od.quantity, 
           ISNULL(p.price2, p.price1) AS price
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
                        ProductName = reader.IsDBNull(0) ? "" : reader.GetString(0),
                        Thumbnail = reader.IsDBNull(1) ? "" : reader.GetString(1),
                        Description = reader.IsDBNull(2) ? "" : reader.GetString(2),
                        Quantity = reader.IsDBNull(3) ? 0 : reader.GetInt32(3),
                        Price = reader.IsDBNull(4) ? 0 : reader.GetDecimal(4)
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
        public IActionResult CreateOrder([FromBody] OrderCheckoutDto orderDto)
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
                // 📌 Lấy địa chỉ mặc định từ DB
                string fullAddress = "";
                using (var addrCmd = new SqlCommand(@"
            SELECT CONCAT_WS(', ', detail, street, ward, district, city) 
            FROM address 
            WHERE address_id = @addrId", conn, tran))
                {
                    addrCmd.Parameters.AddWithValue("@addrId", orderDto.AddressId);
                    var result = addrCmd.ExecuteScalar();
                    if (result != null)
                        fullAddress = result.ToString();
                    else
                        return BadRequest(new { message = "Không tìm thấy địa chỉ với ID được cung cấp." });
                }

                // 1. Thêm vào order_tb
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

                // 2. Thêm vào shipment
                using (var cmd = new SqlCommand(@"
            INSERT INTO shipment (shipment_id, order_id, address_id, status)
            VALUES (@shId, @orderId, @addressId, 0)", conn, tran))
                {
                    cmd.Parameters.AddWithValue("@shId", shipmentId);
                    cmd.Parameters.AddWithValue("@orderId", orderId);
                    cmd.Parameters.AddWithValue("@addressId", orderDto.AddressId);
                    cmd.ExecuteNonQuery();
                }

                // 3. Chi tiết sản phẩm
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

                return Ok(new
                {
                    message = "Đặt hàng thành công!",
                    address = fullAddress,
                    orderId = orderId
                });
            }
            catch (Exception ex)
            {
                tran.Rollback();
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = new List<OrderDto>();
            var orderMap = new Dictionary<string, OrderDto>();

            using var conn = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            conn.Open();

            // 1. Thông tin đơn hàng + giao hàng + thanh toán
            using (var cmd = new SqlCommand(@"
        SELECT o.order_id, o.date_created, o.status,
               ISNULL(s.name_receive, u.name) AS receiver_name,
               ISNULL(s.phone_receive, u.phone_number) AS receiver_phone,
               CONCAT_WS(', ', a.detail, a.street, a.ward, a.district, a.city, a.country) AS full_address,
               ISNULL(pm.name, '') AS payment_method,
               i.amount_payable
        FROM order_tb o
        LEFT JOIN shipment s ON o.order_id = s.order_id
        LEFT JOIN address a ON s.address_id = a.address_id
        LEFT JOIN user_tb2 u ON o.buyer = u.user_id
        LEFT JOIN invoice i ON o.order_id = i.order_id
        LEFT JOIN payment_method pm ON i.method = pm.method_id
        ORDER BY o.date_created DESC
    ", conn))
            {
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    var order = new OrderDto
                    {
                        OrderId = reader.GetString(0),
                        DateCreated = reader.GetDateTime(1),
                        Status = reader.GetInt32(2),
                        ReceiverName = reader.IsDBNull(3) ? "" : reader.GetString(3),
                        ReceiverPhone = reader.IsDBNull(4) ? "" : reader.GetString(4),
                        DeliveryAddress = reader.IsDBNull(5) ? "" : reader.GetString(5),
                        PaymentMethod = reader.IsDBNull(6) ? "" : reader.GetString(6),
                        TotalPrice = reader.IsDBNull(7) ? 0 : reader.GetDecimal(7),
                        Products = new List<ProductDto>()
                    };

                    orders.Add(order);
                    orderMap[order.OrderId] = order;
                }
                reader.Close();
            }

            // 2. Lấy chi tiết sản phẩm từng đơn
            using (var cmd = new SqlCommand(@"
        SELECT od.order_id, p.name, p.url_image1, p.description, od.quantity, od.price
        FROM order_d od
        JOIN product p ON od.product_id = p.product_id
    ", conn))
            {
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    var orderId = reader.GetString(0);
                    if (!orderMap.ContainsKey(orderId)) continue;

                    var product = new ProductDto
                    {
                        ProductName = reader.IsDBNull(1) ? "" : reader.GetString(1),
                        Thumbnail = reader.IsDBNull(2) ? "" : reader.GetString(2),
                        Description = reader.IsDBNull(3) ? "" : reader.GetString(3),
                        Quantity = reader.GetInt32(4),
                        Price = reader.GetDecimal(5)
                    };

                    orderMap[orderId].Products.Add(product);
                }
            }

            // 3. Nếu thiếu tổng tiền, tính lại từ sản phẩm
            foreach (var order in orders)
            {
                if (order.TotalPrice <= 0)
                {
                    order.TotalPrice = order.Products.Sum(p => p.Price * p.Quantity);
                }
            }

            return Ok(orders);
        }
        [HttpPut("update/{orderId}")]
        public IActionResult UpdateOrder(string orderId, [FromBody] OrderUpdateDto dto)
        {
            if (dto == null || orderId != dto.OrderId)
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });

            // TODO: xử lý cập nhật dữ liệu vào DB (order_tb, shipment, order_d...)

            return Ok(new { message = "Cập nhật thành công!" });
        }
    }
}



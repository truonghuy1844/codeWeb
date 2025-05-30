    using Microsoft.AspNetCore.Mvc;
    using ToyStore.Models;
    using Microsoft.EntityFrameworkCore;

    namespace ToyStore.Controllers
    {
        [ApiController]
        [Route("api/[controller]")]
        public class CartController : ControllerBase
        {
            private readonly AppDbContext _context;

            public CartController(AppDbContext context)
            {
                _context = context;
            }

            [HttpPost("add")]
            public IActionResult AddToCart([FromBody] CartItemDto item)
            {
                try
                {
                    var existing = _context.Carts
                        .FirstOrDefault(c => c.UserId == item.UserId && c.ProductId == item.ProductId);

                    if (existing != null)
                    {
                        existing.Quantity = (existing.Quantity ?? 0) + item.Quantity;
                        _context.Carts.Update(existing);
                    }
                    else
                    {
                        var cart = new Cart
                        {
                            UserId = item.UserId,
                            ProductId = item.ProductId,
                            ProductName = item.ProductName,
                            Quantity = item.Quantity,
                            Price = item.Price
                        };
                        _context.Carts.Add(cart);
                    }

                    _context.SaveChanges();
                    return Ok(new { success = true, message = "Đã thêm vào giỏ hàng" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Lỗi: " + ex.Message);
                }
            }

            [HttpGet]
            public IActionResult GetCart([FromQuery] int userId)
            {
                try
                {
                    var cartItems = (from c in _context.Carts
                                     join p in _context.Products on c.ProductId equals p.ProductId
                                     where c.UserId == userId
                                     select new CartItemDto
                                     {
                                         UserId = c.UserId,
                                         ProductId = c.ProductId,
                                         ProductName = c.ProductName,
                                         Quantity = c.Quantity ?? 0,
                                         UrlImage = p.UrlImage1,
                                         Price1 = p.Price1,
                                         Price2 = p.Price2,
                                         Price = (decimal)((p.Price2.HasValue && p.Price2.Value < p.Price1) ? p.Price2 : p.Price1),
                                         PiId = "pi-001",
                                         Cost = 0
                                     }).ToList();

                    return Ok(cartItems);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Lỗi: " + ex.Message);
                }
            }


            [HttpDelete("remove")]
            public IActionResult RemoveFromCart(int userId, string productId)
            {
                try
                {
                    var item = _context.Carts.FirstOrDefault(c => c.UserId == userId && c.ProductId == productId);
                    if (item == null)
                        return NotFound("Không tìm thấy sản phẩm trong giỏ hàng.");

                    _context.Carts.Remove(item);
                    _context.SaveChanges();

                    return Ok(new { success = true, message = "Đã xoá khỏi giỏ hàng" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Lỗi: " + ex.Message);
                }
            }

            [HttpPatch("update")]
            public IActionResult UpdateQuantity([FromBody] CartItemDto item)
            {
                try
                {
                    var cartItem = _context.Carts.FirstOrDefault(c => c.UserId == item.UserId && c.ProductId == item.ProductId);
                    if (cartItem == null)
                        return NotFound("Không tìm thấy sản phẩm để cập nhật.");

                    cartItem.Quantity = item.Quantity;
                    _context.SaveChanges();

                    return Ok(new { success = true, message = "Đã cập nhật số lượng" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Lỗi: " + ex.Message);
                }
            }

            [HttpDelete("clear")]
            public IActionResult ClearCart([FromQuery] int userId)
            {
                var items = _context.Carts.Where(c => c.UserId == userId).ToList();
                _context.Carts.RemoveRange(items);
                _context.SaveChanges();

                return Ok();
            }
        }
    }
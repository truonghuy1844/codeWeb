using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using ToyStore.Models;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public CartController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("add")]
    public IActionResult AddToCart([FromBody] CartItemDto item)
    {
        try
        {
            using (SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("WebCodeDb")))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("add_to_cart", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@user_id", item.UserId);
                    cmd.Parameters.AddWithValue("@product_id", item.ProductId);
                    cmd.Parameters.AddWithValue("@product_name", item.ProductName);
                    cmd.Parameters.AddWithValue("@quantity", item.Quantity);
                    cmd.Parameters.AddWithValue("@price", item.Price);

                    cmd.ExecuteNonQuery();
                }
            }

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
        var cartItems = new List<CartItemDto>();

        try
        {
            using (SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("WebCodeDb")))
            {
                conn.Open();
                var query = "SELECT * FROM cart WHERE user_id = @user_id";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@user_id", userId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            cartItems.Add(new CartItemDto
                            {
                                UserId = (int)reader["user_id"],
                                ProductId = reader["product_id"].ToString(),
                                ProductName = reader["product_name"].ToString(),
                                Quantity = (int)reader["quantity"],
                                Price = Convert.ToDecimal(reader["price"])
                            });
                        }
                    }
                }
            }

            return Ok(cartItems);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Lỗi khi lấy giỏ hàng: " + ex.Message);
        }
    }

}

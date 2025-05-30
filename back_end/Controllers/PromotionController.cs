using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromotionController : ControllerBase
    {
        private readonly IConfiguration _config;

        public PromotionController(IConfiguration config)
        {
            _config = config;
        }

        // GET: api/promotion/active-products
        [HttpGet("active-products")]
        public IActionResult GetPromotedProducts()
        {
            var result = new List<object>();

            using (var conn = new SqlConnection(_config.GetConnectionString("WebCodeDb")))
            {
                conn.Open();
                var cmd = new SqlCommand(@"
                    SELECT 
                        p.promotion_id,
                        p.promotion_name,
                        p.description,
                        p.date_start,
                        p.date_end,
                        pr.product_id,
                        pr.name AS product_name,
                        pr.price1,
                        pr.price2,
                        pr.url_image1
                    FROM promotion p
                    JOIN promotion_product pp ON p.promotion_id = pp.promotion_id
                    JOIN product pr ON pp.product_id = pr.product_id
                    WHERE 
                        p.status = 1 AND pp.status = 1
                        AND GETDATE() BETWEEN p.date_start AND ISNULL(p.date_end, GETDATE())
                ", conn);

                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    DateTime? dateEnd = reader["date_end"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["date_end"]);

                    result.Add(new
                    {
                        PromotionId = reader["promotion_id"].ToString(),
                        PromotionName = reader["promotion_name"].ToString(),
                        Description = reader["description"].ToString(),
                        DateStart = Convert.ToDateTime(reader["date_start"]),
                        DateEnd = dateEnd,
                        ProductId = reader["product_id"].ToString(),
                        ProductName = reader["product_name"].ToString(),
                        Price1 = reader["price1"] != DBNull.Value ? Convert.ToDecimal(reader["price1"]) : 0,
                        Price2 = reader["price2"] != DBNull.Value ? Convert.ToDecimal(reader["price2"]) : 0,
                        Image = reader["url_image1"].ToString()
                    });
                }
            }

            return Ok(result);
        }

        // GET: api/promotion/{id}/products
        [HttpGet("{id}/products")]
        public IActionResult GetProductsByPromotion(string id)
        {
            var result = new List<object>();

            using (var conn = new SqlConnection(_config.GetConnectionString("WebCodeDb")))
            {
                conn.Open();
                var cmd = new SqlCommand(@"
                    SELECT 
                        pr.product_id, 
                        pr.name, 
                        pr.price1, 
                        pr.price2, 
                        pr.url_image1
                    FROM promotion_product pp
                    JOIN product pr ON pp.product_id = pr.product_id
                    WHERE pp.promotion_id = @id AND pp.status = 1
                ", conn);
                cmd.Parameters.AddWithValue("@id", id);

                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    result.Add(new
                    {
                        ProductId = reader["product_id"].ToString(),
                        Name = reader["name"].ToString(),
                        Price1 = reader["price1"] != DBNull.Value ? Convert.ToDecimal(reader["price1"]) : 0,
                        Price2 = reader["price2"] != DBNull.Value ? Convert.ToDecimal(reader["price2"]) : 0,
                        Image = reader["url_image1"].ToString()
                    });
                }
            }

            return Ok(result);
        }

        // GET: api/promotion/list
        [HttpGet("list")]
        public IActionResult GetPromotionList()
        {
            var result = new List<object>();

            using (var conn = new SqlConnection(_config.GetConnectionString("WebCodeDb")))
            {
                conn.Open();
                var cmd = new SqlCommand(@"
                    SELECT TOP 20 
                        promotion_id,
                        promotion_name,
                        description,
                        date_start,
                        date_end,
                        banner_url
                    FROM promotion
                    WHERE status = 1
                    ORDER BY date_start DESC
                ", conn);

                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    result.Add(new
                    {
                        Id = reader["promotion_id"].ToString(),
                        Title = reader["promotion_name"].ToString(),
                        Description = reader["description"].ToString(),
                        Date = Convert.ToDateTime(reader["date_start"]).ToString("MMM dd, yyyy"),
                        Banner = reader["banner_url"]?.ToString() ?? "https://via.placeholder.com/600x200?text=Promotion"
                    });
                }
            }

            return Ok(result);
        }
    }
}

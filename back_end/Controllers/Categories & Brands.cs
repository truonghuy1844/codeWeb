using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back_end.Models.Entity;
using back_end.Models;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly WebCodeContext _context;

        public CategoriesController(WebCodeContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _context.Categories
                    .Select(c => new
                    {
                        categoryId = c.CategoryId,
                        categoryName = c.CategoryName
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi tải danh mục",
                    error = ex.Message
                });
            }
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class BrandsController : ControllerBase
    {
        private readonly WebCodeContext _context;

        public BrandsController(WebCodeContext context)
        {
            _context = context;
        }

        // GET: api/Brands
        [HttpGet]
        public async Task<IActionResult> GetBrands()
        {
            try
            {
                var brands = await _context.Brands
                    .Select(b => new
                    {
                        brandId = b.BrandId,
                        brandName = b.BrandName
                    })
                    .ToListAsync();

                return Ok(brands);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi tải danh mục",
                    error = ex.Message
                });
            }
        }
    }
}
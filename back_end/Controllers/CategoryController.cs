using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back_end.Models.Entity;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly WebCodeContext _context;

        public CategoryController(WebCodeContext context)
        {
            _context = context;
        }

        // ✅ GET: /api/categories
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _context.Categories
                .Where(c => c.Status == true)
                .Select(c => new
                {
                    c.CategoryId,
                    c.CategoryName
                })
                .ToListAsync();

            return Ok(categories);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using back_end.Models.Entity;
using Microsoft.EntityFrameworkCore;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly WebCodeContext _context;

        public UsersController(WebCodeContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.UserDetails)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null || user.UserDetails == null)
                return NotFound();

            return Ok(new
            {
                name = user.UserDetails.Name,
                email = user.UserDetails.Email,
                phone = user.UserDetails.PhoneNumber,
                birthday = user.UserDetails.Birthday?.ToString("yyyy-MM-dd"),
                address = user.UserDetails.Address,
                gender = "Nam" // bạn có thể thay đổi nếu có dữ liệu giới tính
            });
        }
    }
}

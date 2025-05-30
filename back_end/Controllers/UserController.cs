using back_end.DataTransferObject;
using back_end.Models.Entity;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly WebCodeContext _context;

        public UserController(WebCodeContext context)
        {
            _context = context;
        }

        [HttpGet("get/{userId}")]
        public IActionResult GetUser(int userId)
        {
            var user = _context.Users.Find(userId);
            if (user == null)
            {
                return NotFound($"User with ID {userId} not found.");
            }

            var userDetails = _context.UserDetails.FirstOrDefault(u => u.UserId == userId);
            var userDto = new UserDto
            {
                // Thông tin lưu vào bảng user
                UserName = user.UserName,
                Password = user.Password,
                IsAdmin = user.IsAdmin,
                IsBuyer = user.IsBuyer,
                IsSeller = user.IsSeller,

                // Thông tin từ bảng user_details
                Name = userDetails?.Name ?? string.Empty,
                Birthday = userDetails?.Birthday?.ToDateTime(TimeOnly.MinValue),
                Email = userDetails?.Email ?? string.Empty,
                PhoneNumber = userDetails?.PhoneNumber ?? string.Empty,
                Address = userDetails?.Address ?? string.Empty,
            };
            return Ok(userDto);
        }

        [HttpPost("create")]
        public IActionResult CreateUser([FromBody] UserDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrEmpty(dto.UserName) || string.IsNullOrEmpty(dto.Password))
                {
                    return BadRequest("Invalid user data.");
                }

                var user = _context.Users.FirstOrDefault(u => u.UserName == dto.UserName);
                if (user != null)
                {
                    return BadRequest($"User {dto.UserName} đã tồn tại");
                }

                user = new User
                {
                    UserName = dto.UserName,
                    Password = dto.Password,
                    IsAdmin = dto.IsAdmin,
                    IsBuyer = dto.IsBuyer,
                    IsSeller = dto.IsSeller,
                    Department = dto.Department,
                    DateCreated = DateOnly.FromDateTime(DateTime.Now)
                };
                // Lưu thay đổi
                _context.Users.Add(user);
                _context.SaveChanges();

                var userDetails = new UserDetails
                {
                    UserId = user.UserId,
                    Name = dto.Name,
                    Birthday = DateOnly.FromDateTime(dto.Birthday.GetValueOrDefault()),
                    PhoneNumber = dto.PhoneNumber,
                    Address = dto.Address,
                    Email = dto.Email
                };
                // Lưu thay đổi
                _context.UserDetails.Add(userDetails);
                _context.SaveChanges();

                return Ok("Tạo user thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Lỗi khi tạo user: {ex.Message}");
            }
        }

        [HttpPost("update/{userId}")]
        public IActionResult UpdateUser(int userId, [FromBody] UserDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrEmpty(dto.UserName) || string.IsNullOrEmpty(dto.Password))
                {
                    return BadRequest("Invalid user data.");
                }

                var user = _context.Users.Find(userId);
                if (user == null)
                {
                    return NotFound($"User với ID {userId} không tồn tại.");
                }

                // Cập nhật thông tin người dùng
                user.UserName = dto.UserName;
                user.Password = dto.Password;
                user.IsAdmin = dto.IsAdmin;
                user.IsBuyer = dto.IsBuyer;
                user.IsSeller = dto.IsSeller;
                user.Department = dto.Department;

                // Cập nhật thông tin chi tiết người dùng
                user.UserDetails.Address = dto.Address;
                user.UserDetails.Birthday = DateOnly.FromDateTime(dto.Birthday.GetValueOrDefault());
                user.UserDetails.Email = dto.Email;
                user.UserDetails.Name = dto.Name;
                user.UserDetails.PhoneNumber = dto.PhoneNumber;

                // Lưu thay đổi
                _context.Users.Update(user);
                _context.SaveChanges();
                return Ok(user.UserId);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Lỗi khi cập nhật user: {ex.Message}");
            }
        }

        [HttpDelete("delete/{userId}")]
        public IActionResult DeleteUser(int userId)
        {
            try
            {
                var user = _context.Users.Find(userId);
                if (user == null)
                {
                    return NotFound($"User with ID {userId} not found.");
                }
                // Xóa thông tin chi tiết người dùng nếu có
                var userDetails = _context.UserDetails.FirstOrDefault(u => u.UserId == userId);
                if (userDetails != null)
                {
                    _context.UserDetails.Remove(userDetails);
                }
                // Xóa người dùng
                _context.Users.Remove(user);
                _context.SaveChanges();
                return Ok($"User with ID {userId} deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting user: {ex.Message}");
            }
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

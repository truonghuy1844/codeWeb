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
                Rank = user.Rank,
                IsBanned = user.IsBanned,
                IsFrozen = user.IsFrozen,
                IsNotify = user.IsNotify,

                // Thông tin từ bảng user_details
                Name = userDetails?.Name ?? string.Empty,
                Birthday = userDetails?.Birthday?.ToDateTime(TimeOnly.MinValue),
                Email = userDetails?.Email ?? string.Empty,
                PhoneNumber = userDetails?.PhoneNumber ?? string.Empty,
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

                var user = new User
                {
                    UserName = dto.UserName,
                    Password = dto.Password,
                    IsAdmin = dto.IsAdmin,
                    IsBuyer = dto.IsBuyer,
                    IsSeller = dto.IsSeller,
                    Rank = dto.Rank,
                    IsBanned = dto.IsBanned,
                    IsFrozen = dto.IsFrozen,
                    IsNotify = dto.IsNotify,
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

                return Ok(user.UserId);
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
                user.Rank = dto.Rank;
                user.IsBanned = dto.IsBanned;
                user.IsFrozen = dto.IsFrozen;
                user.IsNotify = dto.IsNotify;

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
    }
}

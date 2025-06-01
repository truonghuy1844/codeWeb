using System.ComponentModel.DataAnnotations;
using back_end.DataTransferObject;
using back_end.Models;
using back_end.Models.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        //USER
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                if (_context.Users.Any(u => u.UserName == dto.Name))
                    return BadRequest(new { message = "Tên đăng nhập đã tồn tại." });

                if (_context.UserDetails.Any(d => d.Email == dto.Email))
                    return BadRequest(new { message = "Email đã tồn tại." });

                var user = new User
                {
                    UserName = dto.Name,
                    Password = dto.Password,
                    DateCreated = DateOnly.FromDateTime(DateTime.Now)
                };
                _context.Users.Add(user);
                _context.SaveChanges();

                var address = new Address
                {
                    AddressId = $"addr{user.UserId}_1",
                    City = dto.City,
                    District = dto.District,
                    Ward = dto.Ward,
                    Street = dto.Street,
                    Detail = dto.Detail,
                    UserId = user.UserId,
                    Status = true
                };
                _context.Addresses.Add(address);
                string formattedAddress = $"{dto.Detail}, {dto.Street}, {dto.Ward}, {dto.District}, {dto.City}";


                var details = new UserDetails
                {
                    UserId = user.UserId,
                    Name = dto.Name,
                    Birthday = dto.Birthday.HasValue ? DateOnly.FromDateTime(dto.Birthday.Value) : null,
                    PhoneNumber = dto.PhoneNumber,
                    Address = dto.Address,
                    Email = dto.Email
                };
                _context.UserDetails.Add(details);
                _context.SaveChanges();

                return Ok(new { message = "Đăng ký thành công", userId = user.UserId });
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, new { message = "Lỗi database: " + dbEx.InnerException?.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi không xác định: " + ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            try
            {
                var user = _context.Users
                    .Include(u => u.UserDetails)
                    .FirstOrDefault(u => u.UserDetails.Email == dto.Email && u.Password == dto.Password);

                if (user == null)
                    return Unauthorized("Email hoặc mật khẩu không chính xác.");

                return Ok(new
                {
                    message = "Đăng nhập thành công",
                    user.UserId,
                    user.UserDetails.Name,
                    user.UserDetails.Email
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }
        //Get của user

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users
                .Include(u => u.UserDetails)
                .FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null) return NotFound();

            return Ok(new
            {
                name = user.UserDetails.Name,
                email = user.UserDetails.Email,
                phone = user.UserDetails.PhoneNumber,
                birthday = user.UserDetails.Birthday?.ToString("yyyy-MM-dd"),
                address = user.UserDetails.Address,
            });
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] UpdateInfoDto dto)
        {
            var user = _context.Users
                .Include(u => u.UserDetails)
                .FirstOrDefault(u => u.UserId == id);
            if (user == null) return NotFound();

            user.UserDetails.Name = dto.Name;
            user.UserDetails.Birthday = dto.Birthday.HasValue ? DateOnly.FromDateTime(dto.Birthday.Value) : null;
            user.UserDetails.PhoneNumber = dto.PhoneNumber;
            user.UserDetails.Address = dto.Address;
            _context.SaveChanges();

            return Ok(new { message = "Cập nhật thành công" });
        }


        //CỦA ADMIN????
        [HttpGet("get/{userId}")]
        public IActionResult GetUser(int userId)
        {
            var user = _context.Users.Find(userId);
            if (user == null) return NotFound();

            var userDetails = _context.UserDetails.FirstOrDefault(u => u.UserId == userId);
            var userDto = new UserDto
            {
                UserName = user.UserName,
                Password = user.Password,
                IsAdmin = user.IsAdmin,
                IsBuyer = user.IsBuyer,
                IsSeller = user.IsSeller,
                //Department = user.Department,
                Name = userDetails?.Name ?? string.Empty,
                Birthday = userDetails?.Birthday?.ToDateTime(TimeOnly.MinValue),
                Email = userDetails?.Email ?? string.Empty,
                PhoneNumber = userDetails?.PhoneNumber ?? string.Empty,
                Address = userDetails?.Address ?? string.Empty,
            };
            return Ok(userDto);
        }

        [HttpPost("search")]
        public IActionResult SearchUsers([FromBody] UserQuery query)
        {
            var queryResult = _context.Users.Include(u => u.UserDetails).OrderByDescending(u => u.UserId).AsQueryable();
            if (query.Status != null)
            {
                queryResult = queryResult.Where(u => u.Status == query.Status);
            }
            if (!string.IsNullOrWhiteSpace(query.SearchContent))
            {
                queryResult = queryResult.Where(u => u.UserName.ToLower().Contains(query.SearchContent.ToLower()));
            }
            var result = queryResult.ToList().Select(u => new UserDto
            {
                UserId = u.UserId,
                UserName = u.UserName,
                Password = u.Password,
                IsAdmin = u.IsAdmin,
                IsBuyer = u.IsBuyer,
                IsSeller = u.IsSeller,
                //Department = u.Department,
                Name = u.UserDetails?.Name ?? string.Empty,
                Birthday = u.UserDetails?.Birthday?.ToDateTime(TimeOnly.MinValue),
                Email = u.UserDetails?.Email ?? string.Empty,
                PhoneNumber = u.UserDetails?.PhoneNumber ?? string.Empty,
                Address = u.UserDetails?.Address ?? string.Empty
            }).ToList();

            return Ok(result);
        }

        [HttpPost("upsert")]
        public IActionResult UpdateUser([FromBody] UserDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrEmpty(dto.UserName) || string.IsNullOrEmpty(dto.Password))
                    return BadRequest("Invalid user data.");

                if (dto.UserId == 0)
                {
                    var newUser = new User
                    {
                        UserName = dto.UserName,
                        Password = dto.Password,
                        IsAdmin = dto.IsAdmin,
                        IsBuyer = dto.IsBuyer,
                        IsSeller = dto.IsSeller,
                        //Department = dto.Department,
                        DateCreated = DateOnly.FromDateTime(DateTime.Now)
                    };
                    _context.Users.Add(newUser);
                    _context.SaveChanges();

                    var userDetails = new UserDetails
                    {
                        UserId = newUser.UserId,
                        Name = dto.Name,
                        Birthday = DateOnly.FromDateTime(dto.Birthday.GetValueOrDefault()),
                        PhoneNumber = dto.PhoneNumber,
                        Address = dto.Address,
                        Email = dto.Email
                    };
                    _context.UserDetails.Add(userDetails);
                    _context.SaveChanges();
                    return Ok($"Tạo user thành công {newUser.UserId}");
                }

                var user = _context.Users.Find(dto.UserId);
                user.UserName = dto.UserName;
                user.Password = dto.Password;
                user.IsAdmin = dto.IsAdmin;
                user.IsBuyer = dto.IsBuyer;
                user.IsSeller = dto.IsSeller;
                //user.Department = dto.Department;
                _context.Users.Update(user);
                _context.SaveChanges();

                var userDetail = _context.UserDetails.FirstOrDefault(u => u.UserId == dto.UserId);
                if (userDetail != null)
                {
                    userDetail.Address = dto.Address;
                    userDetail.Birthday = DateOnly.FromDateTime(dto.Birthday.GetValueOrDefault());
                    userDetail.Email = dto.Email;
                    userDetail.Name = dto.Name;
                    userDetail.PhoneNumber = dto.PhoneNumber;
                    _context.UserDetails.Update(userDetail);
                    _context.SaveChanges();
                }

                return Ok($"Update user thành công {user.UserId}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Lỗi khi cập nhật user: {ex.Message}");
            }
        }

        [HttpDelete("delete/{userId}")]
        public IActionResult DeleteUser(string userId)
        {
            try
            {
                int parseId = int.Parse(userId);
                var user = _context.Users.Find(parseId);
                if (user == null) return NotFound($"User with ID {userId} not found.");

                var userDetails = _context.UserDetails.FirstOrDefault(u => u.UserId == parseId);
                if (userDetails != null) _context.UserDetails.Remove(userDetails);

                _context.Users.Remove(user);
                _context.SaveChanges();
                return Ok($"User with ID {userId} deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting user: {ex.Message}");
            }
        }


    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using ToyStore.Models;

namespace ToyStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // POST: /api/User/register
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
                    DateCreated = DateTime.Now
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
                    Status = true // Đây là mặc định
                };
                _context.Addresses.Add(address);
                string formattedAddress = $"{dto.Detail}, {dto.Street}, {dto.Ward}, {dto.District}, {dto.City}";

                var details = new UserDetails
                {
                    UserId = user.UserId,
                    Name = dto.Name,
                    Birthday = dto.Birthday,
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
                var inner = dbEx.InnerException?.Message;
                Console.WriteLine("DbUpdateException: " + inner);
                return StatusCode(500, new { message = "Lỗi database: " + inner });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khác: " + ex.Message);
                return StatusCode(500, new { message = "Lỗi không xác định: " + ex.Message });
            }
        }

        // POST: /api/User/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
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

        // GET: /api/User/{id}
        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            var user = _context.Users
                .Include(u => u.UserDetails)
                .FirstOrDefault(u => u.UserId == id);

            if (user == null) return NotFound();

            return Ok(new
            {
                user.UserId,
                user.UserDetails.Name,
                user.UserDetails.Email,
                user.UserDetails.Birthday,
                user.UserDetails.PhoneNumber,
                user.UserDetails.Address
            });
        }

        // PUT: /api/User/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] UpdateInfoDto dto)
        {
            var user = _context.Users.Include(u => u.UserDetails).FirstOrDefault(u => u.UserId == id);
            if (user == null) return NotFound();

            user.UserDetails.Name = dto.Name;
            user.UserDetails.Birthday = dto.Birthday;
            user.UserDetails.PhoneNumber = dto.PhoneNumber;
            user.UserDetails.Address = dto.Address;

            _context.SaveChanges();
            return Ok(new { message = "Cập nhật thành công" });
        }
    }

    // DTOs
    public class RegisterDto
    {
        // Thêm các phần tử địa chỉ
        [Required]
        public string City { get; set; }

        [Required]
        public string District { get; set; }

        [Required]
        public string Ward { get; set; }

        [Required]
        public string Street { get; set; }

        [Required]
        public string Detail { get; set; }

        [Required(ErrorMessage = "Họ và tên không được để trống.")]
        [StringLength(100, ErrorMessage = "Tên tối đa 100 ký tự.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Ngày sinh không được để trống.")]
        [DataType(DataType.Date)]
        [DateNotInFuture(ErrorMessage = "Ngày sinh không hợp lệ.")]
        public DateTime? Birthday { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được để trống.")]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "Số điện thoại phải đúng 10 số.")]
        [RegularExpression(@"^0\d{9}$", ErrorMessage = "Số điện thoại không hợp lệ.")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Địa chỉ không được để trống.")]
        [StringLength(200, ErrorMessage = "Địa chỉ tối đa 200 ký tự.")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Email không được để trống.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được để trống.")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Mật khẩu có ít nhất 8 ký tự.")]
        public string Password { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UpdateInfoDto
    {
        public string Name { get; set; }
        public DateTime? Birthday { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
    }

    public class AddressDto
    {
        public string City { get; set; }
        public string District { get; set; }
        public string Ward { get; set; }
        public string Street { get; set; }
        public string Detail { get; set; }
    }

}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Net;
using ToyStore.Models;

namespace ToyStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AddressController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AddressController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Address/user/abc123
        [HttpGet("user/{userId}")]
        public IActionResult GetByUser(int userId)
        {
            Console.WriteLine($"Nhận được userId: {userId}");
            var addresses = _context.Addresses
                .Where(a => a.UserId == userId)
                .Select(a => new {
                    a.AddressId,
                    a.City,
                    a.District,
                    a.Ward,
                    a.Street,
                    a.Detail,
                    a.Status
                })
                .ToList();

            return Ok(addresses);
        }

        // POST: api/Address
        [HttpPost("user/{userId}")]
        public IActionResult Create(int userId, [FromBody] AddressDto dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Dữ liệu địa chỉ không hợp lệ." });
            }
            // 1. Kiểm tra người dùng có tồn tại không
            var userExists = _context.Users.Any(u => u.UserId == userId);
            if (!userExists)
            {
                return NotFound(new { message = $"Không tìm thấy người dùng với ID = {userId}" });
            }

            // 2. Kiểm tra user đã có địa chỉ nào chưa → địa chỉ đầu tiên sẽ là mặc định (status = true)
            bool hasAddress = _context.Addresses.Any(a => a.UserId == userId);

            // 3. Tạo địa chỉ mới
            int count = _context.Addresses.Count(a => a.UserId == userId);
            string newId = $"addr{userId}_{count + 1}";

            while (_context.Addresses.Any(a => a.AddressId == newId))
            {
                count++;
                newId = $"addr{count + 1}";
            }

            var address = new Address
            {
                AddressId = newId,
                City = dto.City,
                District = dto.District,
                Ward = dto.Ward,
                Street = dto.Street,
                Detail = dto.Detail,
                UserId = userId,
                Status = !hasAddress  // Nếu chưa có địa chỉ nào → là mặc định
            };

            _context.Addresses.Add(address);
            _context.SaveChanges();

            return Ok(new
            {
                message = hasAddress ? "Thêm địa chỉ mới thành công." : "Thêm địa chỉ mặc định đầu tiên thành công."
            });

        }

        // PUT: /api/Address/{userId}/{addressId}
        [HttpPut("{userId}/{addressId}")]
        public IActionResult Update(int userId, string addressId, [FromBody] AddressDto dto)
        {
            var address = _context.Addresses
                .FirstOrDefault(a => a.AddressId == addressId && a.UserId == userId);

            if (address == null)
            {
                return NotFound(new { message = "Không tìm thấy địa chỉ thuộc user này." });
            }

            // Cập nhật thông tin
            address.City = dto.City;
            address.District = dto.District;
            address.Ward = dto.Ward;
            address.Street = dto.Street;
            address.Detail = dto.Detail;

            _context.SaveChanges();

            return Ok(new { message = "Cập nhật địa chỉ thành công." });
        }

        // DELETE: /api/Address/{userId}/{addressId}
        [HttpDelete("{userId}/{addressId}")]
        public IActionResult DeleteAddress(int userId, string addressId)
        {
            var address = _context.Addresses
                .FirstOrDefault(a => a.UserId == userId && a.AddressId == addressId);

            if (address == null)
                return NotFound(new { message = "Không tìm thấy địa chỉ cần xoá." });

            // Không cho xoá nếu là địa chỉ mặc định
            if (address.Status == true)
                return BadRequest(new { message = "Không thể xoá địa chỉ mặc định." });

            _context.Addresses.Remove(address);
            _context.SaveChanges();

            return Ok(new { message = "Xoá địa chỉ thành công." });
        }

        // PUT /api/Address/set-default/{userId}/{addressId}
        [HttpPut("set-default/{userId}/{addressId}")]
        public IActionResult SetDefaultAddress(int userId, string addressId)
        {
            var address = _context.Addresses
                .FirstOrDefault(a => a.UserId == userId && a.AddressId == addressId);

            if (address == null)
                return NotFound(new { message = "Không tìm thấy địa chỉ thuộc user này." });


            // Bỏ mặc định ở tất cả địa chỉ của user
            var all = _context.Addresses.Where(a => a.UserId == userId);
            foreach (var a in all)
            {
                a.Status = false;
            }

            // Gán mặc định cho địa chỉ được chọn
            address.Status = true;

            // Cập nhật cột address trong bảng user_tb2
            var user = _context.Users
                .Include(u => u.UserDetails)
                .FirstOrDefault(u => u.UserId == userId);

            if (user?.UserDetails != null)
            {
                string formatted = $"{address.Detail}, {address.Street}, {address.Ward}, {address.District}, {address.City}";
                user.UserDetails.Address = formatted;
                user.UserDetails.Address = formatted;
            }

            _context.SaveChanges();

            return Ok(new { message = "Cập nhật địa chỉ mặc định thành công." });
        }
        // GET /api/Address/default/{userId}
        [HttpGet("default/{userId}")]
        public IActionResult GetDefaultAddress(int userId)
        {
            var addressDto = _context.Addresses
                .Where(a => a.UserId == userId && a.Status == true)
                .Select(a => new
                {
                    a.AddressId, // ✅ Thêm dòng này
                    a.Detail,
                    a.Street,
                    a.Ward,
                    a.District,
                    a.City
                })
                .FirstOrDefault();

            var userDto = _context.UserDetails
                .Where(u => u.UserId == userId)
                .Select(u => new
                {
                    u.Name,
                    u.PhoneNumber
                })
                .FirstOrDefault();

            if (addressDto == null || userDto == null)
                return NotFound(new { message = "Không tìm thấy thông tin địa chỉ mặc định hoặc người dùng." });

            string fullAddress = string.Join(", ", new[]
            {
        addressDto.Detail,
        addressDto.Street,
        addressDto.Ward,
        addressDto.District,
        addressDto.City
    }.Where(x => !string.IsNullOrWhiteSpace(x)));

            return Ok(new
            {
                Name = userDto.Name ?? "",
                Phone = userDto.PhoneNumber ?? "",
                Address = fullAddress,
                AddressId = addressDto.AddressId 
            });
        }
    }
}



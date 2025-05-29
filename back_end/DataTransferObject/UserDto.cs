using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.DataTransferObject
{
    public class UserDto
    {
        // Thông tin lưu vào bảng user
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsBuyer { get; set; }
        public bool IsSeller { get; set; }
        public int Rank { get; set; }
        public bool IsBanned { get; set; }
        public bool IsFrozen { get; set; }
        public bool Notify { get; set; }
        public bool Status { get; set; } = true;

        // Thông tin lưu vào bảng user_details
        public string Name { get; set; }
        public DateTime? Birthday { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
    }
}

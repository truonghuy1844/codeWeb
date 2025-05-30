using System;
using System.ComponentModel.DataAnnotations;
namespace ToyStore.Models
{
    public class DateNotInFutureAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value == null) return true; // Cho phép để trống, để [Required] kiểm riêng
            if (value is DateTime dateValue)
            {
                return dateValue <= DateTime.Today;
            }
            return false;
        }

        public override string FormatErrorMessage(string name)
        {
            return $"Ngày sinh không thể là ngày trong tương lai.";
        }
    }
}

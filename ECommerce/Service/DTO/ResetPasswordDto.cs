using System.ComponentModel.DataAnnotations;

namespace Service.DTO;

public class ResetPasswordDto
{
    [Required(ErrorMessage = "Email is required")]
    [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "OTP is required")]
    [RegularExpression(@"^\d{4}$", ErrorMessage = "OTP must be a 4-digit code")]
    public string Otp { get; set; } = null!;

    [Required(ErrorMessage = "New password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public string NewPassword { get; set; } = null!;
}

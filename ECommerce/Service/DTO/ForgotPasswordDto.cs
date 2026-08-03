using System.ComponentModel.DataAnnotations;

namespace Service.DTO;

public class ForgotPasswordDto
{
    [Required(ErrorMessage = "Email is required")]
    [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = null!;
}

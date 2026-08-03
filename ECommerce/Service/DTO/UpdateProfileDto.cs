using System.ComponentModel.DataAnnotations;

namespace Service.DTO
{
    public class UpdateProfileDto
    {
        [Required(ErrorMessage = "Full name is required")]
        public string FullName { get; set; } = string.Empty;

        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string? NewPassword { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace Service.DTO
{
    public class AdminUpdateUserDto
    {
        [Required]
        [MinLength(2)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        [Required]
        public int RoleId { get; set; }
    }
}


using System.ComponentModel.DataAnnotations;

namespace Service.DTO
{
    public class RoleDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateRoleDto
    {
        [Required]
        [MinLength(2)]
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateRoleDto : CreateRoleDto
    {
        public bool IsActive { get; set; } = true;
    }
}


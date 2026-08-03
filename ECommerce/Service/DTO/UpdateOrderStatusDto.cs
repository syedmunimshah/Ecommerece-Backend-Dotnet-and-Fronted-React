using System.ComponentModel.DataAnnotations;

namespace Service.DTO;

public class UpdateOrderStatusDto
{
    [Required(ErrorMessage = "Status is required")]
    public string Status { get; set; } = null!;
}

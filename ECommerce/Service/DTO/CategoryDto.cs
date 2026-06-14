using System;
using System.ComponentModel.DataAnnotations;

namespace Service.DTO
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateCategoryDto
    {
        [Required]
        [MinLength(2)]
        public string Name { get; set; }
    }

    public class UpdateCategoryDto : CreateCategoryDto
    {
        public bool IsActive { get; set; } = true;
    }
}


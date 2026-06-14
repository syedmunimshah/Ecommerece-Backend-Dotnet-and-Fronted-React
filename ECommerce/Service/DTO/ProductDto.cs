using System.ComponentModel.DataAnnotations;

namespace Service.DTO
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsActive { get; set; }
        public string? Image { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? SellerName { get; set; }
        public int SellerId { get; set; }
    }

    public class CreateProductDto
    {
        [Required(ErrorMessage = "Product name is required")]
        [MinLength(2, ErrorMessage = "Product name must be at least 2 characters")]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
        public int Stock { get; set; }

        public string? Image { get; set; }
        public int? CategoryId { get; set; }
    }

    public class UpdateProductDto : CreateProductDto
    {
        public bool IsActive { get; set; } = true;
    }
}

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Service.DTO
{
    public class ProductVariantDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Sku { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
    }

    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }

        /// <summary>
        /// The product's own price and stock. When <see cref="Variants"/> is non-empty these
        /// are display figures only — the "from" price and the total across options — and the
        /// selected variant decides what is actually charged and decremented.
        /// </summary>
        public decimal Price { get; set; }
        public int Stock { get; set; }

        public bool IsActive { get; set; }
        public string? Image { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? SellerName { get; set; }
        public int SellerId { get; set; }

        /// <summary>Empty for a product sold in a single form. Only active variants are listed.</summary>
        public List<ProductVariantDto> Variants { get; set; } = new();
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

        /// <summary>
        /// Options this product is sold in. Leave empty to sell it in a single form, in which
        /// case Price and Stock above are what customers buy.
        /// </summary>
        public List<SaveProductVariantDto> Variants { get; set; } = new();
    }

    public class SaveProductVariantDto
    {
        /// <summary>Zero or absent creates a new variant; an existing id updates it in place.</summary>
        public int Id { get; set; }

        [Required(ErrorMessage = "Each option needs a name")]
        [MaxLength(80)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(60)]
        public string? Sku { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
        public int Stock { get; set; }

        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; }
    }

    public class UpdateProductDto : CreateProductDto
    {
        public bool IsActive { get; set; } = true;
    }
}

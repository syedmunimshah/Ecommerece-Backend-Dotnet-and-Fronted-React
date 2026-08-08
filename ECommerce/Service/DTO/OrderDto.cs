using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Service.DTO
{
    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int? ProductVariantId { get; set; }
        /// <summary>The option as it was named when ordered; never rewritten afterwards.</summary>
        public string? VariantName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }

    /// <summary>Where an order is being delivered, as captured at checkout.</summary>
    public class ShippingAddressDto
    {
        [Required(ErrorMessage = "Recipient name is required")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone number is required")]
        [MaxLength(20)]
        // Deliberately loose: couriers here accept 03xx-xxxxxxx, +92…, and landlines, and a
        // stricter pattern would reject valid numbers more often than it would catch typos.
        [RegularExpression(@"^[0-9+\-\s()]{7,20}$", ErrorMessage = "Enter a valid phone number")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Address is required")]
        [MaxLength(200)]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "City is required")]
        [MaxLength(80)]
        public string City { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? PostalCode { get; set; }

        [MaxLength(300)]
        public string? Notes { get; set; }
    }

    public class OrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public IEnumerable<OrderItemDto> Items { get; set; }

        /// <summary>Null on orders placed before delivery addresses were collected.</summary>
        public ShippingAddressDto? ShippingAddress { get; set; }
    }

    public class CreateOrderDto
    {
        [Required(ErrorMessage = "A delivery address is required")]
        public ShippingAddressDto ShippingAddress { get; set; } = new();
    }
}


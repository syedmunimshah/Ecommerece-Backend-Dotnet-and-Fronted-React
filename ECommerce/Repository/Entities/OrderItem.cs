using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Repository.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int? ProductVariantId { get; set; }
        public ProductVariant? ProductVariant { get; set; }

        /// <summary>
        /// The variant's label as it was when ordered. Kept alongside the id for the same
        /// reason the shipping address is copied onto the order: renaming "Large" to "XL"
        /// later must not rewrite what a customer already bought.
        /// </summary>
        [MaxLength(80)]
        public string? VariantName { get; set; }

        public int Quantity { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public int? UpdateBy { get; set; }
    }
}
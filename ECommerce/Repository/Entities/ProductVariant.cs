using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Repository.Entities
{
    /// <summary>
    /// One buyable version of a product — "Large", "500ml", "Red / M".
    ///
    /// Price and stock live here rather than on the product because they genuinely differ per
    /// variant: a large pizza costs more than a small one, and running out of size M says
    /// nothing about size L. A product with no variants keeps using its own price and stock,
    /// so every existing product and order carries on working untouched.
    ///
    /// The variant is a single label rather than separate size and colour columns. Two fixed
    /// axes fit clothing and nothing else — a pizza has no colour, a perfume has no size — and
    /// a seller typing "Red / M" gets the same result without a matrix editor to fill in.
    /// </summary>
    public class ProductVariant
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        [MaxLength(80)]
        public string Name { get; set; }

        /// <summary>Seller's own stock-keeping code. Optional, never shown to customers.</summary>
        [MaxLength(60)]
        public string? Sku { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int Stock { get; set; }

        public bool IsActive { get; set; } = true;

        /// <summary>Controls the order the options appear in — S before M before L.</summary>
        public int SortOrder { get; set; }

        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public int? UpdateBy { get; set; }
    }
}

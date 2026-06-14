using System.ComponentModel.DataAnnotations.Schema;

namespace Repository.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public int SellerId { get; set; }
        public SellerProfile Seller { get; set; }
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsActive { get; set; }
        public string? Image { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public int? UpdateBy { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
        public ICollection<Review> Reviews { get; set; }
    }
}
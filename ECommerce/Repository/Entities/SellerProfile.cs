using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entities
{
    public class SellerProfile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string ShopName { get; set; }
        public string? StoreDescription { get; set; }
        public string? StoreAddress { get; set; }
        public string? PhoneNumber { get; set; }
        public int Status { get; set; }
        public int? ApprovedBy { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public bool IsActive { get; set; }
        public ICollection<Product> Products { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public int? UpdateBy { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount{ get; set; }
        public string Status { get; set; }

        // Where this order goes. Copied onto the order rather than referenced from the user's
        // profile: a customer who later edits their address must not silently rewrite where
        // past orders were sent, and the courier needs the address as it was at checkout.
        [MaxLength(100)]
        public string? ShippingName { get; set; }
        [MaxLength(20)]
        public string? ShippingPhone { get; set; }
        [MaxLength(200)]
        public string? ShippingAddress { get; set; }
        [MaxLength(80)]
        public string? ShippingCity { get; set; }
        [MaxLength(20)]
        public string? ShippingPostalCode { get; set; }
        [MaxLength(300)]
        public string? ShippingNotes { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; }
        public Payment Payment { get; set; }
        public ICollection<OrderTracking> OrderTrackings { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public int? UpdateBy { get; set; }

    }
}

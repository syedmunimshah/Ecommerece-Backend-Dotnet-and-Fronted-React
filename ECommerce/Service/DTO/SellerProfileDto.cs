using Repository.Entities;
using System;
using System.ComponentModel.DataAnnotations;

namespace Service.DTO
{
    public class SellerProfileDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string StoreName { get; set; }
        public string? StoreDescription { get; set; }
        public string? StoreAddress { get; set; }
        public string? PhoneNumber { get; set; }
        public int? CreatedBy { get; set; }
        public int Status { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ApprovedBy { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public string UserName { get; set; }
        public string RoleName { get; set; }
        public string StatusName { get; set; }
    }

    public class CreateSellerProfileDto
    {
        [Required]
        [MinLength(2)]
        public string StoreName { get; set; } = string.Empty;
        public string? StoreDescription { get; set; }
        public string? StoreAddress { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class UpdateSellerProfileDto : CreateSellerProfileDto
    {
    }
}


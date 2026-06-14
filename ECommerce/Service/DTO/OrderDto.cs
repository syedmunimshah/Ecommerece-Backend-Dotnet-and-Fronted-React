using System;
using System.Collections.Generic;

namespace Service.DTO
{
    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }

    public class OrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public IEnumerable<OrderItemDto> Items { get; set; }
    }

    public class CreateOrderDto
    {
    }
}


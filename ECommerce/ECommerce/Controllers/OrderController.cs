using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Common.Dto;
using Service.DTO;
using Service.Interfaces;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ECommerce.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [Authorize(Roles = "User")]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _orderService.CreateOrderFromCartAsync(userId, dto);
            return Ok(result);
        }

        [Authorize(Roles = "User")]
        [HttpGet("getmyorders")]
        public async Task<IActionResult> GetMyOrders([FromQuery] PagedRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _orderService.GetOrdersForUserAsync(userId, request);
            return Ok(result);
        }

        [Authorize(Roles = "Seller")]
        [HttpGet("getsellerorders/seller")]
        public async Task<IActionResult> GetSellerOrders([FromQuery] PagedRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var result = await _orderService.GetOrdersForSellerAsync(userId, request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("getall")]
        public async Task<IActionResult> GetAll([FromQuery] PagedRequest request)
        {
            var result = await _orderService.GetAllOrdersAsync(request);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("getbyid/{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
            var result = await _orderService.GetByIdAsync(id, userId, role);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [Authorize(Roles = "Admin,Seller")]
        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
            var result = await _orderService.UpdateStatusAsync(id, dto, userId, role);
            if (result == null)
                return NotFound();

            return Ok(result);
        }
    }
}


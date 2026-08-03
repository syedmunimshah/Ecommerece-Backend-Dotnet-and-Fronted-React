using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Common.Interface;
using Repository.Entities;
using Service.Interfaces;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ECommerce.Controllers
{
    [Route("api/orders")]
    [ApiController]
    [Authorize]
    public class OrderTrackingController : ControllerBase
    {
        private readonly IGenericRepository<OrderTracking> _orderTrackingRepo;
        private readonly IOrderService _orderService;

        public OrderTrackingController(
            IGenericRepository<OrderTracking> orderTrackingRepo,
            IOrderService orderService)
        {
            _orderTrackingRepo = orderTrackingRepo;
            _orderService = orderService;
        }

        [HttpGet("{id:int}/tracking")]
        public async Task<IActionResult> GetTracking(int id)
        {
            // Ownership check: reuse the order-access rules (User owns it, Seller owns a
            // product in it, Admin sees all). Prevents IDOR (enumerating others' orders).
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

            var order = await _orderService.GetByIdAsync(id, userId, role);
            if (order == null)
            {
                return NotFound();
            }

            var trackings = await _orderTrackingRepo.FindGetAllAsync(t => t.OrderId == id);
            var result = trackings
                .OrderBy(t => t.CreatedDate)
                .Select(t => new
                {
                    t.Id,
                    t.OrderId,
                    t.Status,
                    t.CreatedDate
                });

            return Ok(result);
        }
    }
}

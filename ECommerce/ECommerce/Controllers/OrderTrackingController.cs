using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Common.Interface;
using Repository.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace ECommerce.Controllers
{
    [Route("api/orders")]
    [ApiController]
    [Authorize]
    public class OrderTrackingController : ControllerBase
    {
        private readonly IGenericRepository<OrderTracking> _orderTrackingRepo;

        public OrderTrackingController(IGenericRepository<OrderTracking> orderTrackingRepo)
        {
            _orderTrackingRepo = orderTrackingRepo;
        }

        [HttpGet("{id:int}/tracking")]
        public async Task<IActionResult> GetTracking(int id)
        {
            var trackings = await _orderTrackingRepo.FindGetAllAsync(t => t.OrderId == id);
            if (!trackings.Any())
            {
                return NotFound();
            }

            return Ok(trackings.OrderBy(t => t.CreatedDate));
        }
    }
}


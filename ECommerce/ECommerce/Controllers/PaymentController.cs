using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.DTO;
using Service.Interfaces;
using Stripe;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ECommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User,Admin,Seller")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePaymentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _paymentService.CreateAsync(userId, dto);
            return Ok(result);
        }

        [HttpGet("{orderId:int}")]
        public async Task<IActionResult> GetByOrder(int orderId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
            var result = await _paymentService.GetByOrderIdAsync(orderId, userId, role);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        /// <summary>
        /// Called by the checkout success page with the Stripe session id to confirm
        /// the payment (and mark the order paid) without relying solely on webhooks.
        /// </summary>
        [HttpGet("confirm")]
        public async Task<IActionResult> Confirm([FromQuery] string sessionId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _paymentService.ConfirmCheckoutAsync(userId, sessionId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        /// <summary>
        /// Stripe webhook receiver. Called by Stripe (not the browser), so it is
        /// anonymous but authenticated via the Stripe signature header.
        /// </summary>
        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> Webhook()
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync();
            var signature = Request.Headers["Stripe-Signature"];

            try
            {
                await _paymentService.HandleWebhookAsync(json, signature);
                return Ok();
            }
            catch (StripeException)
            {
                // Invalid signature / payload — tell Stripe to treat as a failed delivery.
                return BadRequest();
            }
        }
    }
}


using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTO;
using Service.Interfaces;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ECommerce.Controllers
{
    [Route("api/chat")]
    [ApiController]
    // Sign-in is required: the assistant answers questions about the caller's own orders and
    // cart, and an open endpoint would also let anyone spend the project's model budget.
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("message")]
        public async Task<IActionResult> Send([FromBody] ChatRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Identity comes from the token, never from the request body or the conversation.
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

            try
            {
                var result = await _chatService.SendAsync(userId, role, dto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, ex.Message);
            }
        }
    }
}

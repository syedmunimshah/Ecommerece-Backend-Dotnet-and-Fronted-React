using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Common.Dto;
using Service.Component;
using Service.DTO;
using Service.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ECommerce.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SellerProfilesController : ControllerBase
    {
        private readonly ISellerProfileService _sellerProfileService;

        public SellerProfilesController(ISellerProfileService sellerProfileService)
        {
            _sellerProfileService = sellerProfileService;
        }

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSellerProfileDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _sellerProfileService.CreateAsync(userId, dto);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PagedRequest request)
        {
            var result = await _sellerProfileService.GetPagedAsync(request);
            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllPendingSeller([FromQuery] PagedRequest request)
        {
            var result = await _sellerProfileService.GetAllPendingSeller(request);
            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> PendingSellerRequestAccept(int id)
        {
            var userid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _sellerProfileService.PendingSellerRequestAccept(id, userid);
            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> PendingSellerRequestReject(int id)
        {
            var userid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _sellerProfileService.PendingSellerRequestReject(id, userid);
            return Ok(result);
        }

        //[Authorize(Roles = "Admin,Seller")]
        //[HttpGet("{id:int}")]
        //public async Task<IActionResult> GetById(int id)
        //{
        //    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        //    var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
        //    var result = await _sellerProfileService.GetByIdAsync(id, userId, role);
        //    if (result == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(result);
        //}

        //[Authorize(Roles = "Admin,Seller")]
        //[HttpPut("{id:int}")]
        //public async Task<IActionResult> Update(int id, [FromBody] UpdateSellerProfileDto dto)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        //    var role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
        //    var result = await _sellerProfileService.UpdateAsync(id, userId, role, dto);
        //    if (result == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(result);
        //}

        //[Authorize(Roles = "Admin")]
        //[HttpDelete("{id:int}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        //    await _sellerProfileService.DeleteAsync(id, adminId);
        //    return NoContent();
        //}
    }
}


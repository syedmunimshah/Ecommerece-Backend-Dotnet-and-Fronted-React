using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Common.Dto;
using Service.DTO;
using Service.Interfaces;

namespace ECommerce.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [Authorize(Roles = "Seller")]
        [HttpPost]
        [RequestSizeLimit(5 * 1024 * 1024)]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromServices] IFileStorageService fileStorage)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Image file is required.");

            try
            {
                await using var stream = file.OpenReadStream();
                var (url, fileName) = await fileStorage.SaveProductImageAsync(
                    stream, file.FileName, file.ContentType, file.Length);

                return Ok(new ImageUploadResponseDto { Url = url, FileName = fileName });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Seller")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _productService.CreateProductAsync(userId, dto);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] PagedRequest request,
            [FromQuery] int? sellerId,
            [FromQuery] int? categoryId,
            [FromQuery] string? search)
        {
            var result = await _productService.GetPagedAsync(request, sellerId, categoryId, search);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> Search(
            [FromQuery] PagedRequest request,
            [FromQuery] string? q,
            [FromQuery] int? categoryId,
            [FromQuery] int? sellerId)
        {
            var result = await _productService.GetPagedAsync(request, sellerId, categoryId, q);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _productService.GetByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [Authorize(Roles = "Seller")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _productService.UpdateProductAsync(userId, id, dto);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [Authorize(Roles = "Seller")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            await _productService.DeleteProductAsync(userId, id);
            return NoContent();
        }
    }
}

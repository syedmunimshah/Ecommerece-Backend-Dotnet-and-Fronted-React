using Service.DTO;
using Repository.Common.Dto;
namespace Service.Interfaces
{
    public interface IProductService
    {
        Task<ProductDto> CreateProductAsync(int sellerUserId, CreateProductDto dto);
        Task<ProductDto?> GetByIdAsync(int id);
        Task<PagedResponse<ProductDto>> GetPagedAsync(
            PagedRequest request,
            int? sellerId = null,
            int? categoryId = null,
            string? search = null);
        Task<ProductDto?> UpdateProductAsync(int sellerUserId, int productId, UpdateProductDto dto);
        Task DeleteProductAsync(int sellerUserId, int productId);
    }
}

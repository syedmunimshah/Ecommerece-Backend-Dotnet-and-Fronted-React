using Repository.Common.Dto;
using Service.DTO;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewDto> CreateAsync(int userId, CreateReviewDto dto);
        Task<PagedResponse<ReviewDto>> GetByProductAsync(int productId, PagedRequest request);
        Task DeleteAsync(int reviewId, int userId, string role);
    }
}


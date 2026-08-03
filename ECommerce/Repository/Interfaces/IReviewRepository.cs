using Repository.Common.Dto;
using Repository.Entities;

namespace Repository.Interfaces;

public interface IReviewRepository
{
    Task<PagedResponse<Review>> GetPagedByProductAsync(int productId, PagedRequest request);
}

using System;
using System.Threading.Tasks;
using Repository.Common.Dto;
using Repository.Common.Interface;
using Repository.Entities;
using Service.Common.Mapper;
using Service.DTO;
using Service.Interfaces;

namespace Service.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly IGenericRepository<Review> _reviewRepo;
        private readonly IGenericRepository<Product> _productRepo;
        private readonly IGenericMapper _mapper;

        public ReviewService(
            IGenericRepository<Review> reviewRepo,
            IGenericRepository<Product> productRepo,
            IGenericMapper mapper)
        {
            _reviewRepo = reviewRepo;
            _productRepo = productRepo;
            _mapper = mapper;
        }

        public async Task<ReviewDto> CreateAsync(int userId, CreateReviewDto dto)
        {
            var product = await _productRepo.GetByIdAsync(dto.ProductId);
            if (product == null || !product.IsActive)
            {
                throw new InvalidOperationException("Product not found or inactive.");
            }

            var entity = new Review
            {
                ProductId = dto.ProductId,
                UserId = userId,
                Rating = dto.Rating,
                Comment = dto.Comment ?? string.Empty,
                CreatedDate = DateTime.UtcNow
            };

            await _reviewRepo.AddAsync(entity);
            await _reviewRepo.SaveChangesAsync();

            return _mapper.Map<Review, ReviewDto>(entity);
        }

        public async Task<PagedResponse<ReviewDto>> GetByProductAsync(int productId, PagedRequest request)
        {
            var paged = await _reviewRepo.GetPagedAsync(request);
            var filtered = System.Linq.Enumerable.Where(paged.Data, r => r.ProductId == productId);
            var dtoData = _mapper.MapList<Review, ReviewDto>(filtered);
            return new PagedResponse<ReviewDto>
            {
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = dtoData.Count(),
                Data = dtoData
            };
        }

        public async Task DeleteAsync(int reviewId, int userId, string role)
        {
            var entity = await _reviewRepo.GetByIdAsync(reviewId);
            if (entity == null)
            {
                return;
            }

            var isAdmin = string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase);
            if (!isAdmin && entity.UserId != userId)
            {
                throw new UnauthorizedAccessException("You cannot delete this review.");
            }

            _reviewRepo.Delete(entity);
            await _reviewRepo.SaveChangesAsync();
        }
    }
}


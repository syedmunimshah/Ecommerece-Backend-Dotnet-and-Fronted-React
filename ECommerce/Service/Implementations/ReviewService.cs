using System;
using System.Threading.Tasks;
using Repository.Common.Dto;
using Repository.Common.Interface;
using Repository.Entities;
using Repository.Interfaces;
using Service.Common.Mapper;
using Service.DTO;
using Service.Interfaces;

namespace Service.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly IGenericRepository<Review> _reviewRepo;
        private readonly IGenericRepository<Product> _productRepo;
        private readonly IGenericRepository<User> _userRepo;
        private readonly IReviewRepository _reviewRepository;
        private readonly IGenericMapper _mapper;

        public ReviewService(
            IGenericRepository<Review> reviewRepo,
            IGenericRepository<Product> productRepo,
            IGenericRepository<User> userRepo,
            IReviewRepository reviewRepository,
            IGenericMapper mapper)
        {
            _reviewRepo = reviewRepo;
            _productRepo = productRepo;
            _userRepo = userRepo;
            _reviewRepository = reviewRepository;
            _mapper = mapper;
        }

        public async Task<ReviewDto> CreateAsync(int userId, CreateReviewDto dto)
        {
            var product = await _productRepo.GetByIdAsync(dto.ProductId);
            if (product == null || !product.IsActive)
                throw new InvalidOperationException("Product not found or inactive.");

            // One review per user per product (prevents rating manipulation via duplicates).
            var alreadyReviewed = await _reviewRepo.AnyAsync(r => r.ProductId == dto.ProductId && r.UserId == userId);
            if (alreadyReviewed)
                throw new InvalidOperationException("You have already reviewed this product.");

            var user = await _userRepo.GetByIdAsync(userId);

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

            return MapToDto(entity, user?.FullName, product.Name);
        }

        public async Task<PagedResponse<ReviewDto>> GetByProductAsync(int productId, PagedRequest request)
        {
            var paged = await _reviewRepository.GetPagedByProductAsync(productId, request);
            var dtoData = paged.Data.Select(r => MapToDto(r, r.User?.FullName, r.Product?.Name)).ToList();

            return new PagedResponse<ReviewDto>
            {
                PageNumber = paged.PageNumber,
                PageSize = paged.PageSize,
                TotalRecords = paged.TotalRecords,
                Data = dtoData
            };
        }

        public async Task DeleteAsync(int reviewId, int userId, string role)
        {
            var entity = await _reviewRepo.GetByIdAsync(reviewId);
            if (entity == null)
                return;

            var isAdmin = string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase);
            if (!isAdmin && entity.UserId != userId)
                throw new UnauthorizedAccessException("You cannot delete this review.");

            _reviewRepo.Delete(entity);
            await _reviewRepo.SaveChangesAsync();
        }

        private static ReviewDto MapToDto(Review entity, string? userName, string? productName)
        {
            return new ReviewDto
            {
                Id = entity.Id,
                ProductId = entity.ProductId,
                UserId = entity.UserId,
                UserName = userName ?? string.Empty,
                ProductName = productName ?? string.Empty,
                Rating = entity.Rating,
                Comment = entity.Comment,
                CreatedDate = entity.CreatedDate,
            };
        }
    }
}

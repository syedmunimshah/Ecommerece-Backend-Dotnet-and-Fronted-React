using Microsoft.EntityFrameworkCore;
using Repository.Common.Dto;
using Repository.Entities;
using Repository.Interfaces;

namespace Repository.Implementations;

public class ReviewRepository : IReviewRepository
{
    private readonly AppDbContext _context;

    public ReviewRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<Review>> GetPagedByProductAsync(int productId, PagedRequest request)
    {
        var query = _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Product)
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedDate);

        var totalRecords = await query.CountAsync();
        var data = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return new PagedResponse<Review>
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalRecords = totalRecords,
            Data = data,
        };
    }
}

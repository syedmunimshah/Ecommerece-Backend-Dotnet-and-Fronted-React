using Microsoft.EntityFrameworkCore;
using Repository.Common.Dto;
using Repository.Common.Implementation;
using Repository.Entities;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Implementations
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        private readonly AppDbContext _context;
      
        public ProductRepository(AppDbContext context):base (context)
        {
            _context = context; 
        }
        public Task<Product?> GetProductWithDetails(int id)
        {

           return _context.Products.AsNoTracking().Include(s=>s.Seller).ThenInclude(u=>u.User).Include(c=>c.Category).Include(p=>p.Variants).FirstOrDefaultAsync(s=>s.Id == id);
        }

        public async Task<PagedResponse<Product>> GetAllPagedProductWithDetails(
            PagedRequest request,
            int? sellerId = null,
            int? categoryId = null,
            string? search = null)
        {
            var query = _context.Products
                .AsNoTracking()
                .Include(s => s.Seller).ThenInclude(u => u.User)
                .Include(c => c.Category)
                .Include(p => p.Variants)
                .AsQueryable();

            if (sellerId.HasValue)
                query = query.Where(p => p.SellerId == sellerId.Value);
            else
                query = query.Where(p => p.IsActive);   // public catalog shows active products only

            if (categoryId.HasValue)
                query = query.Where(p => p.CategoryId == categoryId.Value);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                query = query.Where(p =>
                    p.Name.Contains(term) ||
                    (p.Description != null && p.Description.Contains(term)) ||
                    (p.Category != null && p.Category.Name.Contains(term)));
            }

            var totalRecords = await query.CountAsync();
            var data = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return new PagedResponse<Product>
            {
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalRecords,
                Data = data
            };
        }
    }
}

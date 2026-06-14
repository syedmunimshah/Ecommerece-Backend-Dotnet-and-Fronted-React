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

           return _context.Products.Include(s=>s.Seller).ThenInclude(u=>u.User).Include(c=>c.Category).FirstOrDefaultAsync(s=>s.Id == id);
        }

        public async Task<PagedResponse<Product>> GetAllPagedProductWithDetails(PagedRequest request)
        {
            var query = _context.Products.Include(s => s.Seller).ThenInclude(u => u.User).Include(c => c.Category);
            var totalRecords = await query.CountAsync();
            var data = await query.Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
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

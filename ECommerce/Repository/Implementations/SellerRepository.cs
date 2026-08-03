using Microsoft.EntityFrameworkCore;
using Repository.Common.Implementation;
using Repository.Entities;
using Repository.Interfaces;
namespace Repository.Implementations

{
    public class SellerRepository : GenericRepository<SellerProfile>, ISellerRepository
    {
        private readonly AppDbContext _context;
        public SellerRepository(AppDbContext context):base(context) 
        {

            _context = context;

        }
        public async Task<SellerProfile> GetSellerWithUser(int id)
        {
            return await _context.SellerProfiles.Include(x => x.User).ThenInclude(r=>r.Role).FirstOrDefaultAsync(s => s.Id == id && s.Status==0);
        }
    }
}

using Repository.Common.Dto;
using Repository.Common.Interface;
using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IProductRepository:IGenericRepository<Product>
    {
       public Task<Product?>  GetProductWithDetails(int id);
        public Task<PagedResponse<Product>> GetAllPagedProductWithDetails(PagedRequest request);
    }
}

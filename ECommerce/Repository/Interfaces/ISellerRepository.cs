using Repository.Common.Interface;
using Repository.Entities;
using Repository.Implementations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface ISellerRepository: IGenericRepository<SellerProfile>
    {
        public Task<SellerProfile> GetSellerWithUser(int id);
    }
}

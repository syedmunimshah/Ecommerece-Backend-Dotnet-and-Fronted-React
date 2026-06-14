using Repository.Common.Dto;
using Service.DTO;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface ISellerProfileService
    {
        Task<SellerProfileDto> CreateAsync(int userId, CreateSellerProfileDto dto);
        Task<PagedResponse<SellerProfileDto>> GetPagedAsync(PagedRequest request);
        Task<PagedResponse<SellerProfileDto>> GetAllPendingSeller(PagedRequest request);
        Task<SellerProfileDto> PendingSellerRequestAccept(int id,int userid); 
        Task<SellerProfileDto> PendingSellerRequestReject(int id,int userid);

        Task<SellerProfileDto?> GetByIdAsync(int id, int requestingUserId, string role);
        Task<SellerProfileDto?> UpdateAsync(int id, int requestingUserId, string role, UpdateSellerProfileDto dto);
        Task DeleteAsync(int id, int adminUserId);
    }
}


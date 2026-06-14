using Repository.Common.Dto;
using Service.DTO;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface IAdminService
    {
        Task<PagedResponse<UserDto>> GetUsersAsync(PagedRequest request);
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto?> UpdateUserAsync(int id, AdminUpdateUserDto dto, int adminUserId);
        Task DeleteUserAsync(int id, int adminUserId);
    }
}


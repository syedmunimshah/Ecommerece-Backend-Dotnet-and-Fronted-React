using Repository.Common.Dto;
using Service.DTO;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface IRoleService
    {
        Task<RoleDto> CreateAsync(CreateRoleDto dto, int adminUserId);
        Task<PagedResponse<RoleDto>> GetPagedAsync(PagedRequest request);
        Task<RoleDto?> GetByIdAsync(int id);
        Task<RoleDto?> UpdateAsync(int id, UpdateRoleDto dto, int adminUserId);
        Task DeleteAsync(int id, int adminUserId);
    }
}


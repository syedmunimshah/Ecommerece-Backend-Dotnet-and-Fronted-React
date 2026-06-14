using Repository.Common.Dto;
using Service.DTO;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryDto> CreateAsync(CreateCategoryDto dto, int adminUserId);
        Task<CategoryDto?> GetByIdAsync(int id);
        Task<PagedResponse<CategoryDto>> GetPagedAsync(PagedRequest request);
        Task<CategoryDto?> UpdateAsync(int id, UpdateCategoryDto dto, int adminUserId);
        Task DeleteAsync(int id, int adminUserId);
    }
}


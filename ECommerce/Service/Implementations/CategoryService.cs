using System;
using System.Threading.Tasks;
using Repository.Common.Dto;
using Repository.Common.Interface;
using Repository.Entities;
using Service.Common.Mapper;
using Service.DTO;
using Service.Interfaces;

namespace Service.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly IGenericRepository<Category> _categoryRepo;
        private readonly IGenericMapper _mapper;

        public CategoryService(IGenericRepository<Category> categoryRepo, IGenericMapper mapper)
        {
            _categoryRepo = categoryRepo;
            _mapper = mapper;
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto, int adminUserId)
        {
            var entity = _mapper.Map<CreateCategoryDto, Category>(dto);
            entity.IsActive = true;
            entity.CreatedBy = adminUserId;
            entity.CreatedDate = DateTime.UtcNow;
            await _categoryRepo.AddAsync(entity);
            await _categoryRepo.SaveChangesAsync();
            return _mapper.Map<Category, CategoryDto>(entity);
        }

        public async Task<CategoryDto?> GetByIdAsync(int id)
        {
            var entity = await _categoryRepo.GetByIdAsync(id);
            return entity == null ? null : _mapper.Map<Category, CategoryDto>(entity);
        }

        public async Task<PagedResponse<CategoryDto>> GetPagedAsync(PagedRequest request)
        {
            var paged = await _categoryRepo.GetPagedAsync(request);
            var dtoData = _mapper.MapList<Category, CategoryDto>(paged.Data);
            return new PagedResponse<CategoryDto>
            {
                PageNumber = paged.PageNumber,
                PageSize = paged.PageSize,
                TotalRecords = paged.TotalRecords,
                Data = dtoData
            };
        }

        public async Task<CategoryDto?> UpdateAsync(int id, UpdateCategoryDto dto, int adminUserId)
        {
            var entity = await _categoryRepo.GetByIdAsync(id);
            if (entity == null)
            {
                return null;
            }

            entity.Name = dto.Name;
            entity.IsActive = dto.IsActive;
            entity.UpdateBy = adminUserId;
            entity.UpdateDate = DateTime.UtcNow;
            _categoryRepo.Update(entity);
            await _categoryRepo.SaveChangesAsync();

            return _mapper.Map<Category, CategoryDto>(entity);
        }

        public async Task DeleteAsync(int id, int adminUserId)
        {
            var entity = await _categoryRepo.GetByIdAsync(id);
            if (entity == null)
            {
                return;
            }

            _categoryRepo.Delete(entity);
            await _categoryRepo.SaveChangesAsync();
        }
    }
}


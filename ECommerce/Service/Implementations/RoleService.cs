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
    public class RoleService : IRoleService
    {
        private readonly IGenericRepository<Role> _roleRepo;
        private readonly IGenericMapper _mapper;

        public RoleService(IGenericRepository<Role> roleRepo, IGenericMapper mapper)
        {
            _roleRepo = roleRepo;
            _mapper = mapper;
        }

        public async Task<RoleDto> CreateAsync(CreateRoleDto dto, int adminUserId)
        {
            var entity = _mapper.Map<CreateRoleDto, Role>(dto);
            entity.IsActive = true;
            entity.CreatedBy = adminUserId;
            entity.CreatedDate = DateTime.UtcNow;
            await _roleRepo.AddAsync(entity);
            await _roleRepo.SaveChangesAsync();
            return _mapper.Map<Role, RoleDto>(entity);
        }

        public async Task<PagedResponse<RoleDto>> GetPagedAsync(PagedRequest request)
        {
            var paged = await _roleRepo.GetPagedAsync(request);
            var dtoData = _mapper.MapList<Role, RoleDto>(paged.Data);
            return new PagedResponse<RoleDto>
            {
                PageNumber = paged.PageNumber,
                PageSize = paged.PageSize,
                TotalRecords = paged.TotalRecords,
                Data = dtoData
            };
        }

        public async Task<RoleDto?> GetByIdAsync(int id)
        {
            var entity = await _roleRepo.GetByIdAsync(id);
            return entity == null ? null : _mapper.Map<Role, RoleDto>(entity);
        }

        public async Task<RoleDto?> UpdateAsync(int id, UpdateRoleDto dto, int adminUserId)
        {
            var entity = await _roleRepo.GetByIdAsync(id);
            if (entity == null)
            {
                return null;
            }

            entity.Name = dto.Name;
            entity.IsActive = dto.IsActive;
            entity.UpdateBy = adminUserId;
            entity.UpdateDate = DateTime.UtcNow;
            _roleRepo.Update(entity);
            await _roleRepo.SaveChangesAsync();

            return _mapper.Map<Role, RoleDto>(entity);
        }

        public async Task DeleteAsync(int id, int adminUserId)
        {
            var entity = await _roleRepo.GetByIdAsync(id);
            if (entity == null)
            {
                return;
            }

            _roleRepo.Delete(entity);
            await _roleRepo.SaveChangesAsync();
        }
    }
}


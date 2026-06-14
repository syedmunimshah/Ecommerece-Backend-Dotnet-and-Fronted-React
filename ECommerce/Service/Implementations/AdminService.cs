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
    public class AdminService : IAdminService
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Role> _roleRepo;
        private readonly IGenericMapper _mapper;

        public AdminService(
            IGenericRepository<User> userRepo,
            IGenericRepository<Role> roleRepo,
            IGenericMapper mapper)
        {
            _userRepo = userRepo;
            _roleRepo = roleRepo;
            _mapper = mapper;
        }

        public async Task<PagedResponse<UserDto>> GetUsersAsync(PagedRequest request)
        {
            var paged = await _userRepo.GetPagedAsync(request);
            var dtoData = _mapper.MapList<User, UserDto>(paged.Data);
            return new PagedResponse<UserDto>
            {
                PageNumber = paged.PageNumber,
                PageSize = paged.PageSize,
                TotalRecords = paged.TotalRecords,
                Data = dtoData
            };
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _userRepo.GetByIdAsync(id);
            return user == null ? null : _mapper.Map<User, UserDto>(user);
        }

        public async Task<UserDto?> UpdateUserAsync(int id, AdminUpdateUserDto dto, int adminUserId)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null)
            {
                return null;
            }

            var role = await _roleRepo.GetByIdAsync(dto.RoleId);
            if (role == null || !role.IsActive)
            {
                throw new InvalidOperationException("Role does not exist or is inactive.");
            }

            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.IsActive = dto.IsActive;
            user.RoleId = dto.RoleId;
            user.UpdateBy = adminUserId;
            user.UpdateDate = DateTime.UtcNow;

            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();

            return _mapper.Map<User, UserDto>(user);
        }

        public async Task DeleteUserAsync(int id, int adminUserId)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null)
            {
                return;
            }

            _userRepo.Delete(user);
            await _userRepo.SaveChangesAsync();
        }
    }
}


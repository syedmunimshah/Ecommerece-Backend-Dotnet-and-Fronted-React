using System;
using System.Linq;
using System.Threading.Tasks;
using Repository.Common.Dto;
using Repository.Common.Interface;
using Repository.Entities;
using Service.Common;
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
            var users = paged.Data.ToList();
            var dtoData = _mapper.MapList<User, UserDto>(users);
            await UserDtoEnricher.ApplyRoleNamesAsync(dtoData, users, _roleRepo);
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
            if (user == null)
            {
                return null;
            }

            var dto = _mapper.Map<User, UserDto>(user);
            await UserDtoEnricher.ApplyRoleNameAsync(dto, user, _roleRepo);
            return dto;
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

            var updated = _mapper.Map<User, UserDto>(user);
            await UserDtoEnricher.ApplyRoleNameAsync(updated, user, _roleRepo);
            return updated;
        }

        public async Task DeleteUserAsync(int id, int adminUserId)
        {
            if (id == adminUserId)
            {
                throw new InvalidOperationException("You cannot delete your own account.");
            }

            var user = await _userRepo.GetByIdAsync(id);
            if (user == null || !user.IsActive)
            {
                return;
            }

            user.IsActive = false;
            user.UpdateBy = adminUserId;
            user.UpdateDate = DateTime.UtcNow;
            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();
        }

        public async Task ActivateUserAsync(int id, int adminUserId)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null || user.IsActive)
            {
                return;
            }

            user.IsActive = true;
            user.UpdateBy = adminUserId;
            user.UpdateDate = DateTime.UtcNow;
            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();
        }
    }
}


using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Repository.Common.Interface;
using Repository.Entities;
using Service.Common;
using Service.Common.Mapper;
using Service.DTO;
using Service.Interfaces;

namespace Service.Implementations
{
    public class UserService : IUserService
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Role> _roleRepo;
        private readonly IGenericMapper _mapper;
        private readonly IFileStorageService _fileStorage;

        public UserService(
            IGenericRepository<User> userRepo,
            IGenericRepository<Role> roleRepo,
            IGenericMapper mapper,
            IFileStorageService fileStorage)
        {
            _userRepo = userRepo;
            _roleRepo = roleRepo;
            _mapper = mapper;
            _fileStorage = fileStorage;
        }

        public async Task<UserDto?> GetProfileAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
            {
                return null;
            }

            var dto = _mapper.Map<User, UserDto>(user);
            await UserDtoEnricher.ApplyRoleNameAsync(dto, user, _roleRepo);
            return dto;
        }

        public async Task<UserDto?> UpdateProfileAsync(int userId, UpdateProfileDto dto)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
            {
                return null;
            }

            user.FullName = dto.FullName;
            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            }
            user.UpdateBy = userId;
            user.UpdateDate = DateTime.UtcNow;

            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();

            var updated = _mapper.Map<User, UserDto>(user);
            await UserDtoEnricher.ApplyRoleNameAsync(updated, user, _roleRepo);
            return updated;
        }

        public async Task<UserDto?> UploadProfileImageAsync(int userId, Stream content, string fileName, string contentType, long length)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
            {
                return null;
            }

            var (url, _) = await _fileStorage.SaveProfileImageAsync(content, fileName, contentType, length);
            user.Imgae = url;
            user.UpdateBy = userId;
            user.UpdateDate = DateTime.UtcNow;

            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();

            var dto = _mapper.Map<User, UserDto>(user);
            await UserDtoEnricher.ApplyRoleNameAsync(dto, user, _roleRepo);
            return dto;
        }
    }
}


using System;
using System.Threading.Tasks;
using Repository.Common.Interface;
using Repository.Entities;
using Service.Common.Mapper;
using Service.DTO;
using Service.Interfaces;

namespace Service.Implementations
{
    public class UserService : IUserService
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericMapper _mapper;

        public UserService(IGenericRepository<User> userRepo, IGenericMapper mapper)
        {
            _userRepo = userRepo;
            _mapper = mapper;
        }

        public async Task<UserDto?> GetProfileAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            return user == null ? null : _mapper.Map<User, UserDto>(user);
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

            return _mapper.Map<User, UserDto>(user);
        }
    }
}


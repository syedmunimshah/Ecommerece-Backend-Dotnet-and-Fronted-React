using Service.DTO;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface IUserService
    {
        Task<UserDto?> GetProfileAsync(int userId);
        Task<UserDto?> UpdateProfileAsync(int userId, UpdateProfileDto dto);
    }
}


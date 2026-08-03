using Service.DTO;
using System.IO;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface IUserService
    {
        Task<UserDto?> GetProfileAsync(int userId);
        Task<UserDto?> UpdateProfileAsync(int userId, UpdateProfileDto dto);
        Task<UserDto?> UploadProfileImageAsync(int userId, Stream content, string fileName, string contentType, long length);
    }
}


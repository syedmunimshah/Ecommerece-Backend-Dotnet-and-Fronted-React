using Service.DTO;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface ICartService
    {
        Task<CartDto> AddItemAsync(int userId, AddCartItemDto dto);
        Task<CartDto> GetCartAsync(int userId);
        Task<CartDto> UpdateItemAsync(int userId, UpdateCartItemDto dto);
        Task<CartDto> RemoveItemAsync(int userId, int cartItemId);
    }
}


using Repository.Common.Dto;
using Service.DTO;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderFromCartAsync(int userId, CreateOrderDto dto);
        Task<PagedResponse<OrderDto>> GetOrdersForUserAsync(int userId, PagedRequest request);
        Task<PagedResponse<OrderDto>> GetOrdersForSellerAsync(int sellerUserId, PagedRequest request);
        Task<PagedResponse<OrderDto>> GetAllOrdersAsync(PagedRequest request);
        Task<OrderDto?> GetByIdAsync(int id, int requestingUserId, string role);
        Task<OrderDto?> UpdateStatusAsync(int orderId, UpdateOrderStatusDto dto, int userId, string role);
    }
}


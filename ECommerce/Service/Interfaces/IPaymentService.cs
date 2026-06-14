using Service.DTO;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentDto> CreateAsync(int userId, CreatePaymentDto dto);
        Task<PaymentDto?> GetByOrderIdAsync(int orderId, int requestingUserId, string role);
    }
}


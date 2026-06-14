using System;
using System.Threading.Tasks;
using Repository.Common.Interface;
using Repository.Entities;
using Service.Common.Mapper;
using Service.DTO;
using Service.Interfaces;

namespace Service.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly IGenericRepository<Payment> _paymentRepo;
        private readonly IGenericRepository<Order> _orderRepo;
        private readonly IGenericMapper _mapper;

        public PaymentService(
            IGenericRepository<Payment> paymentRepo,
            IGenericRepository<Order> orderRepo,
            IGenericMapper mapper)
        {
            _paymentRepo = paymentRepo;
            _orderRepo = orderRepo;
            _mapper = mapper;
        }

        public async Task<PaymentDto> CreateAsync(int userId, CreatePaymentDto dto)
        {
            var order = await _orderRepo.GetByIdAsync(dto.OrderId);
            if (order == null || order.UserId != userId)
            {
                throw new InvalidOperationException("Order not found for user.");
            }

            var payment = new Payment
            {
                OrderId = dto.OrderId,
                Amount = dto.Amount,
                PaymentMethod = dto.PaymentMethod,
                Status = "Paid",
                TransactionId = Guid.NewGuid().ToString(),
                PaidAt = DateTime.UtcNow,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = userId
            };

            await _paymentRepo.AddAsync(payment);
            await _paymentRepo.SaveChangesAsync();

            order.Status = "Processing";
            _orderRepo.Update(order);
            await _orderRepo.SaveChangesAsync();

            return _mapper.Map<Payment, PaymentDto>(payment);
        }

        public async Task<PaymentDto?> GetByOrderIdAsync(int orderId, int requestingUserId, string role)
        {
            var order = await _orderRepo.GetByIdAsync(orderId);
            if (order == null)
            {
                return null;
            }

            if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase) && order.UserId != requestingUserId)
            {
                return null;
            }

            var payment = await _paymentRepo.FirstOrDefaultAsync(p => p.OrderId == orderId);
            if (payment == null)
            {
                return null;
            }

            return _mapper.Map<Payment, PaymentDto>(payment);
        }
    }
}


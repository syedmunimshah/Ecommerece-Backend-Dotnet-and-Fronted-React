using Service.DTO;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface IPaymentService
    {
        /// <summary>
        /// Initiates payment for an order. COD records the payment immediately;
        /// Card returns a Stripe Checkout URL to redirect to. The amount is always
        /// the server-side order total.
        /// </summary>
        Task<PaymentResultDto> CreateAsync(int userId, CreatePaymentDto dto);

        Task<PaymentDto?> GetByOrderIdAsync(int orderId, int requestingUserId, string role);

        /// <summary>Verifies a Stripe checkout session on the success page and marks the order paid if so.</summary>
        Task<PaymentDto?> ConfirmCheckoutAsync(int userId, string sessionId);

        /// <summary>Verifies and processes a Stripe webhook event (raw body + signature header).</summary>
        Task HandleWebhookAsync(string requestJson, string stripeSignature);
    }
}

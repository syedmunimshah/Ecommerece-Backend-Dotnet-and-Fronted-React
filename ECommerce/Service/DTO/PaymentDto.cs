using System;
using System.ComponentModel.DataAnnotations;

namespace Service.DTO
{
    public class CreatePaymentDto
    {
        [Required]
        public int OrderId { get; set; }

        /// <summary>"COD" (cash on delivery) or "Card" (Stripe Checkout).</summary>
        [Required]
        public string PaymentMethod { get; set; }

        // NOTE: no client-supplied Amount. The charge is always the server-side
        // order total, so a client can never under-pay for an order.
    }

    public class PaymentDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public string TransactionId { get; set; }
        public string Status { get; set; }
        public DateTime? PaidAt { get; set; }
    }

    /// <summary>
    /// Result of initiating a payment. For COD the <see cref="Payment"/> is filled
    /// in; for a card payment the caller must redirect the browser to
    /// <see cref="CheckoutUrl"/> (Stripe-hosted checkout).
    /// </summary>
    public class PaymentResultDto
    {
        /// <summary>"cod" or "stripe_checkout".</summary>
        public string Type { get; set; }
        public PaymentDto? Payment { get; set; }
        public string? CheckoutUrl { get; set; }
    }
}

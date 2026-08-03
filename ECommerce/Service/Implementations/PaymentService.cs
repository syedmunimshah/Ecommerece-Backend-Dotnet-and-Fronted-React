using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Repository.Common.Interface;
using Repository.Entities;
using Service.Common.Mapper;
using Service.DTO;
using Service.Interfaces;
using Stripe;
using Stripe.Checkout;

namespace Service.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly IGenericRepository<Payment> _paymentRepo;
        private readonly IGenericRepository<Order> _orderRepo;
        private readonly IConfiguration _config;
        private readonly IGenericMapper _mapper;

        private const string StatusPaid = "Paid";
        private const string StatusPending = "Pending";
        private const string OrderProcessing = "Processing";

        public PaymentService(
            IGenericRepository<Payment> paymentRepo,
            IGenericRepository<Order> orderRepo,
            IConfiguration config,
            IGenericMapper mapper)
        {
            _paymentRepo = paymentRepo;
            _orderRepo = orderRepo;
            _config = config;
            _mapper = mapper;
        }

        public async Task<PaymentResultDto> CreateAsync(int userId, CreatePaymentDto dto)
        {
            var order = await _orderRepo.GetByIdAsync(dto.OrderId);
            if (order == null || order.UserId != userId)
            {
                throw new InvalidOperationException("Order not found for user.");
            }

            var existing = await _paymentRepo.FirstOrDefaultAsync(p => p.OrderId == order.Id);
            if (existing != null && string.Equals(existing.Status, StatusPaid, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("This order has already been paid.");
            }

            var method = (dto.PaymentMethod ?? string.Empty).Trim();
            var isCard = method.Equals("Card", StringComparison.OrdinalIgnoreCase)
                      || method.Equals("Stripe", StringComparison.OrdinalIgnoreCase);

            if (!isCard)
            {
                // Cash on Delivery — record immediately. Amount comes from the order, never the client.
                var codPayment = existing ?? new Payment { OrderId = order.Id, CreatedBy = userId, CreatedDate = DateTime.UtcNow };
                codPayment.PaymentMethod = "COD";
                codPayment.Amount = order.TotalAmount;
                codPayment.Status = StatusPending;            // collected on delivery
                codPayment.TransactionId = $"COD-{order.Id}";
                if (existing == null)
                {
                    await _paymentRepo.AddAsync(codPayment);
                }
                else
                {
                    codPayment.UpdateDate = DateTime.UtcNow;
                    _paymentRepo.Update(codPayment);
                }

                order.Status = OrderProcessing;
                _orderRepo.Update(order);

                await _paymentRepo.SaveChangesAsync();
                await _orderRepo.SaveChangesAsync();

                return new PaymentResultDto { Type = "cod", Payment = _mapper.Map<Payment, PaymentDto>(codPayment) };
            }

            // Card → Stripe Checkout. The charge amount is ALWAYS the server-side order total.
            var secretKey = _config["Stripe:SecretKey"];
            if (string.IsNullOrWhiteSpace(secretKey))
            {
                throw new InvalidOperationException("Stripe is not configured.");
            }
            StripeConfiguration.ApiKey = secretKey;

            var currency = _config["Stripe:Currency"] ?? "usd";
            var successUrl = _config["Stripe:SuccessUrl"] ?? "http://localhost:3000/checkout/success";
            var cancelUrl = _config["Stripe:CancelUrl"] ?? "http://localhost:3000/checkout";

            var options = new SessionCreateOptions
            {
                Mode = "payment",
                SuccessUrl = $"{successUrl}?orderId={order.Id}&session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{cancelUrl}?orderId={order.Id}",
                ClientReferenceId = order.Id.ToString(),
                Metadata = new Dictionary<string, string>
                {
                    ["orderId"] = order.Id.ToString(),
                    ["userId"] = userId.ToString()
                },
                LineItems = new List<SessionLineItemOptions>
                {
                    new()
                    {
                        Quantity = 1,
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = currency,
                            UnitAmountDecimal = order.TotalAmount * 100m,   // smallest currency unit
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = $"EdgeCart Order #{order.Id}"
                            }
                        }
                    }
                }
            };

            var session = await new SessionService().CreateAsync(options);

            // Track a pending card payment so the order reflects an in-flight charge.
            var payment = existing ?? new Payment { OrderId = order.Id, CreatedBy = userId, CreatedDate = DateTime.UtcNow };
            payment.PaymentMethod = "Card";
            payment.Amount = order.TotalAmount;
            payment.Status = StatusPending;
            payment.TransactionId = session.Id;
            if (existing == null)
            {
                await _paymentRepo.AddAsync(payment);
            }
            else
            {
                payment.UpdateDate = DateTime.UtcNow;
                _paymentRepo.Update(payment);
            }
            await _paymentRepo.SaveChangesAsync();

            return new PaymentResultDto { Type = "stripe_checkout", CheckoutUrl = session.Url };
        }

        public async Task HandleWebhookAsync(string requestJson, string stripeSignature)
        {
            var webhookSecret = _config["Stripe:WebhookSecret"];
            if (string.IsNullOrWhiteSpace(webhookSecret))
            {
                throw new InvalidOperationException("Stripe webhook secret is not configured.");
            }

            // Throws StripeException if the signature is invalid — the controller maps that to 400.
            var stripeEvent = EventUtility.ConstructEvent(requestJson, stripeSignature, webhookSecret);

            if (stripeEvent.Type != "checkout.session.completed")
            {
                return;
            }

            if (stripeEvent.Data.Object is not Session session || session.Metadata == null)
            {
                return;
            }

            if (!session.Metadata.TryGetValue("orderId", out var orderIdStr) ||
                !int.TryParse(orderIdStr, out var orderId))
            {
                return;
            }

            await MarkPaidAsync(orderId, session.PaymentIntentId);
        }

        /// <summary>
        /// Confirms a checkout on return from Stripe (success page). Retrieves the
        /// session, verifies ownership, and — if Stripe reports it paid — marks the
        /// order paid. Complements the webhook so payment status is captured even if
        /// the webhook is delayed or not configured (e.g. local dev without Stripe CLI).
        /// </summary>
        public async Task<PaymentDto?> ConfirmCheckoutAsync(int userId, string sessionId)
        {
            if (string.IsNullOrWhiteSpace(sessionId))
            {
                return null;
            }

            var secretKey = _config["Stripe:SecretKey"];
            if (string.IsNullOrWhiteSpace(secretKey))
            {
                throw new InvalidOperationException("Stripe is not configured.");
            }
            StripeConfiguration.ApiKey = secretKey;

            var session = await new SessionService().GetAsync(sessionId);
            if (session?.Metadata == null ||
                !session.Metadata.TryGetValue("orderId", out var orderIdStr) ||
                !int.TryParse(orderIdStr, out var orderId))
            {
                return null;
            }

            var order = await _orderRepo.GetByIdAsync(orderId);
            if (order == null || order.UserId != userId)
            {
                return null;   // ownership check
            }

            Payment? payment;
            if (string.Equals(session.PaymentStatus, "paid", StringComparison.OrdinalIgnoreCase))
            {
                payment = await MarkPaidAsync(orderId, session.PaymentIntentId);
            }
            else
            {
                payment = await _paymentRepo.FirstOrDefaultAsync(p => p.OrderId == orderId);
            }

            return payment == null ? null : _mapper.Map<Payment, PaymentDto>(payment);
        }

        // Idempotently marks an order's payment as paid and moves the order to Processing.
        private async Task<Payment?> MarkPaidAsync(int orderId, string? paymentIntentId)
        {
            var payment = await _paymentRepo.FirstOrDefaultAsync(p => p.OrderId == orderId);
            if (payment == null)
            {
                return null;
            }
            if (string.Equals(payment.Status, StatusPaid, StringComparison.OrdinalIgnoreCase))
            {
                return payment;   // already paid — no-op
            }

            payment.Status = StatusPaid;
            payment.PaidAt = DateTime.UtcNow;
            payment.TransactionId = paymentIntentId ?? payment.TransactionId;
            payment.UpdateDate = DateTime.UtcNow;
            _paymentRepo.Update(payment);

            var order = await _orderRepo.GetByIdAsync(orderId);
            if (order != null)
            {
                order.Status = OrderProcessing;
                _orderRepo.Update(order);
            }

            await _paymentRepo.SaveChangesAsync();
            await _orderRepo.SaveChangesAsync();
            return payment;
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

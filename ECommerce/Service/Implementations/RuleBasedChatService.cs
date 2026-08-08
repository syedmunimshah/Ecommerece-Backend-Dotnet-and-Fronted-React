using Microsoft.Extensions.Logging;
using Repository.Common.Dto;
using Repository.Common.Interface;
using Service.DTO;
using Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using OrderTrackingEntity = Repository.Entities.OrderTracking;

namespace Service.Implementations
{
    /// <summary>
    /// Shopping assistant that answers straight from EdgeCart's own data — no language model,
    /// no API key, no per-message cost. It classifies the question by keyword, runs the same
    /// EdgeCart service a normal HTTP request would run, and formats the result.
    ///
    /// This is the default: <see cref="ChatService"/> takes over only when a Claude API key is
    /// configured. Both implement <see cref="IChatService"/>, so the controller and the whole
    /// front end are identical either way.
    ///
    /// Deliberately read-only. A keyword match is a guess, and a wrong guess that only shows
    /// the wrong list costs nothing, while a wrong guess that writes to someone's cart does.
    /// Adding to the cart therefore stays on the product page, where the customer confirms it.
    /// </summary>
    public class RuleBasedChatService : IChatService
    {
        private const int MaxProductResults = 3;
        private const int MaxOrderResults = 3;

        private static readonly string[] HelpWords = { "help", "what can you do", "how do you work", "who are you" };

        // "orders" and "my order" rather than a bare "order", so that "I want to order a phone"
        // stays a product search instead of listing the customer's order history. A bare "order"
        // still counts when the message also carries an id — that is unambiguously a lookup.
        private static readonly string[] OrderWords =
        {
            "my order", "orders", "order status", "parcel", "shipment", "delivery", "track", "tracking",
        };

        private static readonly string[] CartWords = { "cart", "basket", "trolley" };

        private static readonly string[] Greetings = { "hi", "hey", "hello", "salam", "assalam", "assalamualaikum", "aoa", "yo" };

        // Stripped before a message is used as a catalogue search, so "do you have wireless
        // headphones?" searches for "wireless headphones" rather than the whole sentence —
        // the product search matches on name and description, and the filler words match nothing.
        // Longest first: "how much is" has to go before "how much" leaves "is" behind.
        private static readonly string[] SearchNoise =
        {
            "do you have any", "do you have", "do you sell", "are you selling",
            "i am looking for", "im looking for", "looking for", "i want to buy",
            "i want", "i need", "show me some", "show me", "search for", "search",
            "find me a", "find me", "find", "how much is the", "how much is",
            "how much", "what is the price of", "price of", "tell me about",
            "can you", "please", "the", "a ", "any",
        };

        // Dropped word by word after the phrases above, which cannot catch every arrangement:
        // "I want to order a phone" survives phrase-stripping as "to order phone" and matches
        // nothing. None of these ever help a product-name search. "order" is safe to drop here
        // because the order intents are already decided before a message reaches the search.
        private static readonly HashSet<string> StopWords = new(StringComparer.Ordinal)
        {
            "to", "of", "for", "in", "on", "at", "is", "are", "am", "be", "do", "does", "did",
            "have", "has", "had", "my", "me", "i", "you", "it", "its", "that", "this", "there",
            "what", "want", "need", "buy", "order", "get", "some", "and", "or", "with", "about",
            "thanks", "thank", "hi", "hello",
        };

        private readonly IProductService _productService;
        private readonly IOrderService _orderService;
        private readonly ICartService _cartService;
        private readonly IGenericRepository<OrderTrackingEntity> _trackingRepo;
        private readonly ILogger<RuleBasedChatService> _logger;

        public RuleBasedChatService(
            IProductService productService,
            IOrderService orderService,
            ICartService cartService,
            IGenericRepository<OrderTrackingEntity> trackingRepo,
            ILogger<RuleBasedChatService> logger)
        {
            _productService = productService;
            _orderService = orderService;
            _cartService = cartService;
            _trackingRepo = trackingRepo;
            _logger = logger;
        }

        public async Task<ChatResponseDto> SendAsync(int userId, string role, ChatRequestDto dto)
        {
            var message = (dto.Message ?? string.Empty).Trim();
            var lower = message.ToLowerInvariant();
            var calls = new List<ChatToolCallDto>();

            try
            {
                if (IsGreeting(lower))
                {
                    return Reply(
                        "Hello! Ask me to find a product, check your cart, or look up one of your orders.",
                        calls);
                }

                if (Mentions(lower, HelpWords))
                {
                    return Reply(
                        "I can do three things:\n" +
                        "• Find products — \"do you have wireless headphones\"\n" +
                        "• Check your cart — \"what's in my cart\"\n" +
                        "• Look up an order — \"where is order 14\"\n" +
                        "For refunds or anything else, please contact support.",
                        calls);
                }

                var orderId = FindId(lower);
                if (orderId.HasValue && lower.Contains("order", StringComparison.Ordinal))
                {
                    return await OrderStatusAsync(orderId.Value, userId, role, calls);
                }

                if (Mentions(lower, OrderWords))
                {
                    return await RecentOrdersAsync(userId, calls);
                }

                if (WantsToAdd(lower))
                {
                    return Reply(
                        "I can find it for you, but adding to the cart happens on the product page — " +
                        "that way you confirm the exact item and quantity. Tell me the product name and " +
                        "I'll pull up the link.",
                        calls);
                }

                if (Mentions(lower, CartWords))
                {
                    return await CartAsync(userId, calls);
                }

                // Anything else is treated as a catalogue search. That is the most common thing
                // customers type, and an unmatched search says so plainly rather than pretending.
                return await SearchAsync(message, calls);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Rule-based chat failed for user {UserId}", userId);
                return Reply("Something went wrong looking that up. Please try again in a moment.", calls);
            }
        }

        private async Task<ChatResponseDto> SearchAsync(string message, List<ChatToolCallDto> calls)
        {
            var query = CleanQuery(message);
            if (query.Length < 2)
            {
                return Reply(
                    "Tell me what you're after — a product name, \"my cart\", or an order number.",
                    calls);
            }

            calls.Add(new ChatToolCallDto { Name = "search_products", Input = query });

            var page = await _productService.GetPagedAsync(
                new PagedRequest { PageNumber = 1, PageSize = MaxProductResults },
                search: query);

            var products = page.Data?.ToList() ?? new List<ProductDto>();

            // Product names are singular ("Laptop") but customers type plurals ("laptops"), and
            // the search is a substring match, so the plural finds nothing. Retrying without the
            // trailing "s" costs one query and only on a miss.
            if (products.Count == 0 && query.EndsWith('s') && query.Length > 3)
            {
                query = query[..^1];
                page = await _productService.GetPagedAsync(
                    new PagedRequest { PageNumber = 1, PageSize = MaxProductResults },
                    search: query);
                products = page.Data?.ToList() ?? new List<ProductDto>();
            }

            if (products.Count == 0)
            {
                return Reply(
                    $"I couldn't find anything matching \"{query}\". Try a shorter word, or browse the categories on the shop page.",
                    calls);
            }

            var text = new StringBuilder();
            text.AppendLine(products.Count == 1
                ? "Found one match:"
                : $"Found {page.TotalRecords} match{(page.TotalRecords == 1 ? "" : "es")}. Here are the top ones:");

            foreach (var product in products)
            {
                // A product sold in options has no single price; its Price is the cheapest one,
                // so say "from" rather than quoting a figure the customer may not be able to pay.
                var price = product.Variants.Count > 0
                    ? $"from {Money(product.Price)}"
                    : Money(product.Price);
                text.AppendLine($"• {product.Name} — {price}{StockNote(product.Stock)}");
            }

            var remaining = page.TotalRecords - products.Count;
            if (remaining > 0)
            {
                text.Append($"…and {remaining} more on the shop page.");
            }

            return Reply(text.ToString().TrimEnd(), calls);
        }

        private async Task<ChatResponseDto> RecentOrdersAsync(int userId, List<ChatToolCallDto> calls)
        {
            calls.Add(new ChatToolCallDto { Name = "get_my_orders", Input = string.Empty });

            var page = await _orderService.GetOrdersForUserAsync(
                userId,
                new PagedRequest { PageNumber = 1, PageSize = MaxOrderResults });

            var orders = page.Data?.ToList() ?? new List<OrderDto>();
            if (orders.Count == 0)
            {
                return Reply("You haven't placed an order yet. Once you do, it will show up here.", calls);
            }

            var text = new StringBuilder("Your most recent orders:");
            text.AppendLine();
            foreach (var order in orders)
            {
                text.AppendLine($"• #{order.Id} — {order.Status}, {Money(order.TotalAmount)} ({Date(order.CreatedDate)})");
            }

            text.Append("Ask me \"where is order 14\" for the tracking history of any one of them.");
            return Reply(text.ToString(), calls);
        }

        private async Task<ChatResponseDto> OrderStatusAsync(
            int orderId, int userId, string role, List<ChatToolCallDto> calls)
        {
            calls.Add(new ChatToolCallDto { Name = "get_order_status", Input = orderId.ToString(CultureInfo.InvariantCulture) });

            // GetByIdAsync enforces ownership, so a null here means the order either does not
            // exist or belongs to someone else. Both get the same answer — confirming that
            // another customer's order exists would leak information by itself.
            var order = await _orderService.GetByIdAsync(orderId, userId, role);
            if (order == null)
            {
                return Reply($"There's no order #{orderId} on your account. Check the number on your orders page.", calls);
            }

            var text = new StringBuilder();
            text.AppendLine($"Order #{order.Id} is {order.Status}.");
            text.AppendLine($"Placed {Date(order.CreatedDate)}, total {Money(order.TotalAmount)}, {Count(order.Items?.Count() ?? 0, "item")}.");

            var tracking = (await _trackingRepo.FindGetAllAsync(t => t.OrderId == order.Id))
                .OrderByDescending(t => t.CreatedDate)
                .FirstOrDefault();

            text.Append(tracking != null
                ? $"Latest update: {tracking.Status} on {Date(tracking.CreatedDate)}."
                : "No tracking updates have been added yet.");

            return Reply(text.ToString(), calls);
        }

        private async Task<ChatResponseDto> CartAsync(int userId, List<ChatToolCallDto> calls)
        {
            calls.Add(new ChatToolCallDto { Name = "get_cart", Input = string.Empty });

            var cart = await _cartService.GetCartAsync(userId);
            var items = cart?.Items?.ToList() ?? new List<CartItemDto>();
            if (items.Count == 0)
            {
                return Reply("Your cart is empty right now.", calls);
            }

            var text = new StringBuilder($"Your cart — {Money(cart!.TotalAmount)} in total:");
            text.AppendLine();
            foreach (var item in items)
            {
                // Name the option, or a cart holding a small and a large of the same product
                // reads as two identical lines.
                var label = string.IsNullOrWhiteSpace(item.VariantName)
                    ? item.ProductName
                    : $"{item.ProductName} ({item.VariantName})";
                text.AppendLine($"• {label} ×{item.Quantity} — {Money(item.Price * item.Quantity)}");
            }

            text.Append("Head to checkout when you're ready.");
            return Reply(text.ToString(), calls);
        }

        private static ChatResponseDto Reply(string text, List<ChatToolCallDto> calls) =>
            new() { Reply = text, ToolCalls = calls };

        /// <summary>
        /// True only when the whole message is a greeting. Substring matching would fire on
        /// "hi-fi speakers", which is a product search, not a hello.
        /// </summary>
        private static bool IsGreeting(string lower)
        {
            var words = lower.Split(new[] { ' ', ',', '!', '.', '?' }, StringSplitOptions.RemoveEmptyEntries);
            return words.Length > 0
                && words.Length <= 3
                && words.All(w => Greetings.Contains(w) || w is "there" or "everyone");
        }

        private static bool Mentions(string lower, string[] phrases) =>
            phrases.Any(p => lower.Contains(p, StringComparison.Ordinal));

        /// <summary>
        /// An add-to-cart request, which has to be recognised before the plain "show my cart"
        /// intent — both mention the cart. Matching a verb near a cart word rather than fixed
        /// phrases catches the way people actually type it ("add that to my cart"). The verb is
        /// word-bounded so "address" does not count, and the cart word is required so "I want to
        /// buy headphones" stays a product search.
        /// </summary>
        private static bool WantsToAdd(string lower) =>
            Regex.IsMatch(lower, @"\b(add|put|buy|purchase)\b") && Mentions(lower, CartWords);

        private static int? FindId(string lower)
        {
            var match = Regex.Match(lower, @"#?\b(\d{1,9})\b");
            return match.Success && int.TryParse(match.Groups[1].Value, out var id) ? id : null;
        }

        private static string CleanQuery(string message)
        {
            var text = message.ToLowerInvariant();
            foreach (var noise in SearchNoise)
            {
                text = text.Replace(noise, " ", StringComparison.Ordinal);
            }

            text = Regex.Replace(text, @"[^\w\s-]", " ");

            var words = text
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Where(w => !StopWords.Contains(w));

            var cleaned = string.Join(' ', words).Trim();

            // If stripping the filler left nothing, the message was all filler — fall back to the
            // original words so the search still has something to match on.
            return cleaned.Length >= 2
                ? cleaned
                : Regex.Replace(message, @"\s+", " ").Trim();
        }

        private static string Money(decimal amount) =>
            $"PKR {amount.ToString("N0", CultureInfo.InvariantCulture)}";

        private static string Date(DateTime? value) =>
            value.HasValue ? value.Value.ToString("d MMM yyyy", CultureInfo.InvariantCulture) : "an unknown date";

        private static string Count(int value, string noun) =>
            $"{value} {noun}{(value == 1 ? "" : "s")}";

        private static string StockNote(int stock) => stock switch
        {
            <= 0 => " (out of stock)",
            <= 5 => $" (only {stock} left)",
            _ => string.Empty,
        };
    }
}

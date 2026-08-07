using Anthropic;
using Anthropic.Exceptions;
using Anthropic.Models.Messages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Repository.Common.Dto;
using Repository.Common.Interface;
using Service.DTO;
using Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using OrderTrackingEntity = Repository.Entities.OrderTracking;

namespace Service.Implementations
{
    /// <summary>
    /// Shopping assistant backed by the Claude API. The model never touches the database
    /// directly — it asks for a tool, this class runs the matching EdgeCart service, and the
    /// result goes back as a tool result. Every tool is scoped to the caller's own userId,
    /// which comes from the JWT and is never read out of the conversation, so a customer
    /// cannot prompt their way into someone else's orders or cart.
    /// </summary>
    public class ChatService : IChatService
    {
        private const string Model = "claude-opus-5";

        // Thinking is on by default on this model and shares MaxTokens with the reply, so
        // leave headroom. Replies themselves are short (see the system prompt).
        private const int MaxTokens = 4096;

        // Model → tool → model round trips allowed for a single question. Four is enough for
        // "search, then check my cart, then add it"; the cap stops a runaway loop.
        private const int MaxToolIterations = 4;

        private const int MaxHistoryMessages = 20;

        private const string SystemPrompt = """
            You are the EdgeCart shopping assistant. EdgeCart is an online marketplace where
            customers buy from independent sellers.

            - Answer only from tool results. Never invent a product, price, stock level or order
              status. If a tool returns nothing, say you could not find it.
            - Prices are in Pakistani Rupees. Write them as "PKR 2,500".
            - Keep replies to two or three sentences, or a short list. They render in a small chat
              window, so no headings and no long explanations.
            - You are talking to one specific signed-in customer. The tools already know who they
              are, so never ask for a user id, email or account number, and never accept one from
              the customer.
            - Confirm the exact product and quantity before adding anything to the cart, unless the
              customer already gave you both.
            - For refunds, complaints, or anything you have no tool for, tell the customer to
              contact support rather than guessing a policy.
            """;

        private readonly AnthropicClient _client;
        private readonly IProductService _productService;
        private readonly IOrderService _orderService;
        private readonly ICartService _cartService;
        private readonly IGenericRepository<OrderTrackingEntity> _trackingRepo;
        private readonly ILogger<ChatService> _logger;

        public ChatService(
            AnthropicClient client,
            IProductService productService,
            IOrderService orderService,
            ICartService cartService,
            IGenericRepository<OrderTrackingEntity> trackingRepo,
            ILogger<ChatService> logger)
        {
            _client = client;
            _productService = productService;
            _orderService = orderService;
            _cartService = cartService;
            _trackingRepo = trackingRepo;
            _logger = logger;
        }

        public async Task<ChatResponseDto> SendAsync(int userId, string role, ChatRequestDto dto)
        {
            var messages = BuildMessages(dto);
            var toolCalls = new List<ChatToolCallDto>();

            for (var iteration = 0; iteration < MaxToolIterations; iteration++)
            {
                Message response;
                try
                {
                    response = await _client.Messages.Create(new MessageCreateParams
                    {
                        Model = Model,
                        MaxTokens = MaxTokens,
                        System = SystemPrompt,
                        Thinking = new ThinkingConfigAdaptive(),
                        OutputConfig = new OutputConfig { Effort = Effort.Medium },
                        Tools = BuildTools(),
                        Messages = messages,
                    });
                }
                catch (AnthropicRateLimitException ex)
                {
                    _logger.LogWarning(ex, "Claude rate limit hit for user {UserId}", userId);
                    return Unavailable("The assistant is busy right now. Please try again in a moment.");
                }
                catch (AnthropicApiException ex)
                {
                    _logger.LogError(ex, "Claude request failed for user {UserId}", userId);
                    return Unavailable("The assistant is unavailable right now. Please try again later.");
                }

                if (response.StopReason == "refusal")
                {
                    return Unavailable("I can't help with that. Ask me about products, your cart or your orders.");
                }

                // Split the reply into the text we show, the blocks we must echo back, and the
                // tools we have to run. Thinking blocks are echoed unchanged (the API rejects
                // edited ones) whenever the same turn also contains a tool call.
                var reply = new StringBuilder();
                var assistantContent = new List<ContentBlockParam>();
                var toolResults = new List<ContentBlockParam>();

                foreach (var block in response.Content)
                {
                    if (block.TryPickText(out TextBlock? text))
                    {
                        reply.Append(text.Text);
                        assistantContent.Add(new TextBlockParam { Text = text.Text });
                    }
                    else if (block.TryPickThinking(out ThinkingBlock? thinking))
                    {
                        assistantContent.Add(new ThinkingBlockParam
                        {
                            Thinking = thinking.Thinking,
                            Signature = thinking.Signature,
                        });
                    }
                    else if (block.TryPickRedactedThinking(out RedactedThinkingBlock? redacted))
                    {
                        assistantContent.Add(new RedactedThinkingBlockParam { Data = redacted.Data });
                    }
                    else if (block.TryPickToolUse(out ToolUseBlock? toolUse))
                    {
                        assistantContent.Add(new ToolUseBlockParam
                        {
                            ID = toolUse.ID,
                            Name = toolUse.Name,
                            Input = toolUse.Input,
                        });

                        toolCalls.Add(new ChatToolCallDto
                        {
                            Name = toolUse.Name,
                            Input = JsonSerializer.Serialize(toolUse.Input),
                        });

                        var (payload, isError) = await ExecuteToolAsync(toolUse.Name, toolUse.Input, userId, role);
                        toolResults.Add(new ToolResultBlockParam
                        {
                            ToolUseID = toolUse.ID,
                            Content = payload,
                            IsError = isError,
                        });
                    }
                }

                if (toolResults.Count == 0)
                {
                    var finalReply = reply.ToString().Trim();
                    if (response.StopReason == "max_tokens")
                    {
                        finalReply += "\n\n(Reply was cut short — ask me to continue.)";
                    }

                    return new ChatResponseDto { Reply = finalReply, ToolCalls = toolCalls };
                }

                messages.Add(new MessageParam { Role = Role.Assistant, Content = assistantContent });
                messages.Add(new MessageParam { Role = Role.User, Content = toolResults });
            }

            _logger.LogWarning("Chat hit the {Max}-iteration tool limit for user {UserId}", MaxToolIterations, userId);
            return new ChatResponseDto
            {
                Reply = "That's taking me too many steps. Could you narrow it down a bit?",
                ToolCalls = toolCalls,
            };
        }

        private static ChatResponseDto Unavailable(string message) => new() { Reply = message };

        private static List<MessageParam> BuildMessages(ChatRequestDto dto)
        {
            var messages = new List<MessageParam>();

            var recent = dto.History
                .Where(m => !string.IsNullOrWhiteSpace(m.Content))
                .TakeLast(MaxHistoryMessages);

            foreach (var message in recent)
            {
                var isAssistant = string.Equals(message.Role, "assistant", StringComparison.OrdinalIgnoreCase);
                messages.Add(new MessageParam
                {
                    Role = isAssistant ? Role.Assistant : Role.User,
                    Content = message.Content,
                });
            }

            // The conversation must start with a user turn, and the same role cannot open it twice
            // in a row after a trimmed history — dropping a leading assistant turn covers both.
            while (messages.Count > 0 && messages[0].Role == Role.Assistant)
            {
                messages.RemoveAt(0);
            }

            messages.Add(new MessageParam { Role = Role.User, Content = dto.Message });
            return messages;
        }

        private static List<ToolUnion> BuildTools() => new()
        {
            BuildTool(
                "search_products",
                "Search the EdgeCart catalog by keyword. Use this whenever the customer asks what is available, or asks about a product by name.",
                new Dictionary<string, JsonElement>
                {
                    ["query"] = Property("string", "Keywords to search for, e.g. 'wireless headphones'."),
                    ["max_results"] = Property("integer", "How many products to return, 1 to 10. Defaults to 5."),
                },
                new[] { "query" }),

            BuildTool(
                "get_product_details",
                "Get the full details of one product, including its price, stock and seller.",
                new Dictionary<string, JsonElement>
                {
                    ["product_id"] = Property("integer", "The product's id, taken from a previous search result."),
                },
                new[] { "product_id" }),

            BuildTool(
                "get_my_orders",
                "List the customer's most recent orders with their status and total.",
                new Dictionary<string, JsonElement>()),

            BuildTool(
                "get_order_status",
                "Get one order's current status, its items, and its tracking history.",
                new Dictionary<string, JsonElement>
                {
                    ["order_id"] = Property("integer", "The order's id."),
                },
                new[] { "order_id" }),

            BuildTool(
                "get_cart",
                "Show what is currently in the customer's cart.",
                new Dictionary<string, JsonElement>()),

            BuildTool(
                "add_to_cart",
                "Add a product to the customer's cart. Only call this once the customer has confirmed the product and the quantity.",
                new Dictionary<string, JsonElement>
                {
                    ["product_id"] = Property("integer", "The product's id."),
                    ["quantity"] = Property("integer", "How many units to add. Must be at least 1."),
                },
                new[] { "product_id", "quantity" }),
        };

        private static Tool BuildTool(
            string name,
            string description,
            Dictionary<string, JsonElement> properties,
            string[]? required = null) => new()
            {
                Name = name,
                Description = description,
                InputSchema = new()
                {
                    Properties = properties,
                    Required = required ?? Array.Empty<string>(),
                },
            };

        private static JsonElement Property(string type, string description) =>
            JsonSerializer.SerializeToElement(new { type, description });

        /// <summary>
        /// Runs one tool and returns its JSON payload. <paramref name="userId"/> and
        /// <paramref name="role"/> come from the JWT, so the underlying services apply the same
        /// ownership rules they apply to a normal HTTP request.
        /// </summary>
        private async Task<(string Payload, bool IsError)> ExecuteToolAsync(
            string name,
            IReadOnlyDictionary<string, JsonElement> input,
            int userId,
            string role)
        {
            try
            {
                switch (name)
                {
                    case "search_products":
                        {
                            var query = GetString(input, "query");
                            var max = Math.Clamp(GetInt(input, "max_results") ?? 5, 1, 10);
                            var page = await _productService.GetPagedAsync(
                                new PagedRequest { PageNumber = 1, PageSize = max },
                                search: query);

                            return (Json(new
                            {
                                total_matches = page.TotalRecords,
                                products = page.Data.Select(Summarize),
                            }), false);
                        }

                    case "get_product_details":
                        {
                            var productId = GetInt(input, "product_id");
                            var product = productId.HasValue ? await _productService.GetByIdAsync(productId.Value) : null;
                            if (product == null)
                            {
                                return (Json(new { error = "No product with that id." }), true);
                            }

                            return (Json(Summarize(product)), false);
                        }

                    case "get_my_orders":
                        {
                            var page = await _orderService.GetOrdersForUserAsync(
                                userId,
                                new PagedRequest { PageNumber = 1, PageSize = 5 });

                            return (Json(new
                            {
                                total_orders = page.TotalRecords,
                                orders = page.Data.Select(o => new
                                {
                                    id = o.Id,
                                    status = o.Status,
                                    total_amount = o.TotalAmount,
                                    placed_on = o.CreatedDate,
                                    item_count = o.Items?.Count() ?? 0,
                                }),
                            }), false);
                        }

                    case "get_order_status":
                        {
                            var orderId = GetInt(input, "order_id");
                            var order = orderId.HasValue
                                ? await _orderService.GetByIdAsync(orderId.Value, userId, role)
                                : null;

                            // GetByIdAsync already enforces ownership, so a null here means the
                            // order does not exist or does not belong to this customer. Both get
                            // the same answer — we don't confirm that someone else's order exists.
                            if (order == null)
                            {
                                return (Json(new { error = "No order with that id on this account." }), true);
                            }

                            var tracking = await _trackingRepo.FindGetAllAsync(t => t.OrderId == order.Id);

                            return (Json(new
                            {
                                id = order.Id,
                                status = order.Status,
                                total_amount = order.TotalAmount,
                                placed_on = order.CreatedDate,
                                items = order.Items?.Select(i => new
                                {
                                    product = i.ProductName,
                                    quantity = i.Quantity,
                                    price = i.Price,
                                }),
                                tracking = tracking
                                    .OrderBy(t => t.CreatedDate)
                                    .Select(t => new { status = t.Status, at = t.CreatedDate }),
                            }), false);
                        }

                    case "get_cart":
                        {
                            var cart = await _cartService.GetCartAsync(userId);
                            return (Json(new
                            {
                                total_amount = cart.TotalAmount,
                                items = cart.Items?.Select(i => new
                                {
                                    product_id = i.ProductId,
                                    product = i.ProductName,
                                    quantity = i.Quantity,
                                    price = i.Price,
                                }),
                            }), false);
                        }

                    case "add_to_cart":
                        {
                            var productId = GetInt(input, "product_id");
                            var quantity = GetInt(input, "quantity") ?? 1;
                            if (!productId.HasValue || quantity < 1)
                            {
                                return (Json(new { error = "A valid product_id and a quantity of at least 1 are required." }), true);
                            }

                            var cart = await _cartService.AddItemAsync(
                                userId,
                                new AddCartItemDto { ProductId = productId.Value, Quantity = quantity });

                            return (Json(new
                            {
                                added = true,
                                cart_total = cart.TotalAmount,
                                item_count = cart.Items?.Count() ?? 0,
                            }), false);
                        }

                    default:
                        return (Json(new { error = $"Unknown tool '{name}'." }), true);
                }
            }
            catch (InvalidOperationException ex)
            {
                // Business-rule failures (out of stock, inactive product) are useful to the model:
                // it can tell the customer what went wrong instead of retrying blindly.
                return (Json(new { error = ex.Message }), true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Chat tool {Tool} failed for user {UserId}", name, userId);
                return (Json(new { error = "That lookup failed. Tell the customer to try again shortly." }), true);
            }
        }

        private static object Summarize(ProductDto product) => new
        {
            id = product.Id,
            name = product.Name,
            description = product.Description,
            price = product.Price,
            in_stock = product.Stock,
            category = product.CategoryName,
            seller = product.SellerName,
        };

        private static string Json(object value) => JsonSerializer.Serialize(value);

        private static string GetString(IReadOnlyDictionary<string, JsonElement> input, string key) =>
            input.TryGetValue(key, out var value) && value.ValueKind == JsonValueKind.String
                ? value.GetString() ?? string.Empty
                : string.Empty;

        private static int? GetInt(IReadOnlyDictionary<string, JsonElement> input, string key)
        {
            if (!input.TryGetValue(key, out var value))
            {
                return null;
            }

            // Models occasionally send a number as a string ("3"), so accept both.
            if (value.ValueKind == JsonValueKind.Number && value.TryGetInt32(out var number))
            {
                return number;
            }

            return value.ValueKind == JsonValueKind.String && int.TryParse(value.GetString(), out var parsed)
                ? parsed
                : null;
        }
    }
}

using System.Linq.Expressions;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Repository.Common.Dto;
using Repository.Common.Interface;
using Repository.Entities;
using Service.DTO;
using Service.Implementations;
using Service.Interfaces;

namespace ECommerce.Tests;

/// <summary>
/// Covers the fragile part of the keyword assistant: which intent a message is routed to.
/// The formatting is cosmetic, but a misrouted message shows a customer the wrong thing —
/// and several phrasings genuinely overlap ("add that to my cart" mentions the cart but is
/// not a request to see it; "I want to order a phone" mentions an order but is a search).
/// </summary>
public class RuleBasedChatServiceTests
{
    private const int UserId = 7;

    private readonly Mock<IProductService> _products = new();
    private readonly Mock<IOrderService> _orders = new();
    private readonly Mock<ICartService> _carts = new();
    private readonly Mock<IGenericRepository<OrderTracking>> _tracking = new();

    public RuleBasedChatServiceTests()
    {
        // Empty-but-valid results by default, so each test only stubs what it asserts on.
        _products.Setup(p => p.GetPagedAsync(
                     It.IsAny<PagedRequest>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<string?>()))
                 .ReturnsAsync(Page(Array.Empty<ProductDto>()));
        _orders.Setup(o => o.GetOrdersForUserAsync(It.IsAny<int>(), It.IsAny<PagedRequest>()))
               .ReturnsAsync(Page(Array.Empty<OrderDto>()));
        _carts.Setup(c => c.GetCartAsync(It.IsAny<int>()))
              .ReturnsAsync(new CartDto { Items = Array.Empty<CartItemDto>(), TotalAmount = 0 });
        _tracking.Setup(t => t.FindGetAllAsync(It.IsAny<Expression<Func<OrderTracking, bool>>>()))
                 .ReturnsAsync(Array.Empty<OrderTracking>());
    }

    private RuleBasedChatService CreateService() =>
        new(_products.Object, _orders.Object, _carts.Object, _tracking.Object,
            NullLogger<RuleBasedChatService>.Instance);

    private static PagedResponse<T> Page<T>(IReadOnlyCollection<T> items) =>
        new() { PageNumber = 1, PageSize = 3, TotalRecords = items.Count, Data = items };

    private Task<ChatResponseDto> AskAsync(string message) =>
        CreateService().SendAsync(UserId, "User", new ChatRequestDto { Message = message });

    /// <summary>The tool names recorded on the response are how we assert on the route taken.</summary>
    private static string[] Route(ChatResponseDto response) =>
        response.ToolCalls.Select(t => t.Name).ToArray();

    [Theory]
    [InlineData("what's in my cart")]
    [InlineData("show me my basket")]
    public async Task CartQuestions_ReadTheCart(string message)
    {
        Assert.Equal(new[] { "get_cart" }, Route(await AskAsync(message)));
    }

    [Theory]
    [InlineData("show me my orders")]
    [InlineData("track my parcel")]
    [InlineData("where is my order")]
    public async Task OrderQuestionsWithoutAnId_ListRecentOrders(string message)
    {
        Assert.Equal(new[] { "get_my_orders" }, Route(await AskAsync(message)));
    }

    [Fact]
    public async Task OrderQuestionWithAnId_LooksUpThatOrder()
    {
        _orders.Setup(o => o.GetByIdAsync(14, UserId, "User"))
               .ReturnsAsync(new OrderDto { Id = 14, Status = "Shipped", TotalAmount = 8400, Items = Array.Empty<OrderItemDto>() });

        var response = await AskAsync("where is order 14");

        Assert.Equal(new[] { "get_order_status" }, Route(response));
        Assert.Contains("#14", response.Reply);
        Assert.Contains("Shipped", response.Reply);
    }

    /// <summary>
    /// Ownership is enforced by OrderService, which returns null for an order that is missing
    /// *or* belongs to someone else. Both must produce the same wording — a different message
    /// for "exists but not yours" would confirm another customer's order by itself.
    /// </summary>
    [Fact]
    public async Task OrderThatIsNotTheCallers_IsAnsweredAsNotFound()
    {
        _orders.Setup(o => o.GetByIdAsync(999, UserId, "User")).ReturnsAsync((OrderDto?)null);

        var response = await AskAsync("where is order 999");

        Assert.Contains("no order #999 on your account", response.Reply, StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// "add that to my cart" contains a cart word, so a naive check reads it as "show my cart".
    /// It must reach the add branch instead — which declines, because the assistant is read-only.
    /// </summary>
    [Theory]
    [InlineData("add that to my cart")]
    [InlineData("put it in my basket")]
    public async Task AddRequests_AreDeclinedRatherThanShowingTheCart(string message)
    {
        var response = await AskAsync(message);

        Assert.Empty(Route(response));
        Assert.Contains("product page", response.Reply);
        _carts.Verify(c => c.GetCartAsync(It.IsAny<int>()), Times.Never);
    }

    /// <summary>
    /// Mentioning "order" as a verb is a shopping intent, not a request for order history.
    /// The filler words are stripped so the catalogue actually gets searched for "phone".
    /// </summary>
    [Fact]
    public async Task WantingToOrderSomething_SearchesTheCatalogue()
    {
        var response = await AskAsync("i want to order a phone");

        Assert.Equal(new[] { "search_products" }, Route(response));
        Assert.Equal("phone", response.ToolCalls[0].Input);
        _orders.Verify(o => o.GetOrdersForUserAsync(It.IsAny<int>(), It.IsAny<PagedRequest>()), Times.Never);
    }

    [Fact]
    public async Task UnrecognisedMessages_FallBackToACatalogueSearch()
    {
        var response = await AskAsync("do you have wireless headphones");

        Assert.Equal(new[] { "search_products" }, Route(response));
        Assert.Equal("wireless headphones", response.ToolCalls[0].Input);
    }

    /// <summary>
    /// Product names are singular, customers type plurals, and the search is a substring match.
    /// A miss must be retried without the trailing "s" before we tell anyone we have nothing.
    /// </summary>
    [Fact]
    public async Task APluralThatMissesIsRetriedAsSingular()
    {
        _products.Setup(p => p.GetPagedAsync(It.IsAny<PagedRequest>(), null, null, "keyboard"))
                 .ReturnsAsync(Page(new[] { new ProductDto { Id = 1, Name = "Mechanical Keyboard RGB", Price = 8900, Stock = 10 } }));

        var response = await AskAsync("do you have keyboards");

        Assert.Contains("Mechanical Keyboard RGB", response.Reply);
    }

    /// <summary>A greeting is the whole message — "hi-fi speakers" is a product search.</summary>
    [Theory]
    [InlineData("hi")]
    [InlineData("hello there")]
    public async Task Greetings_AnswerWithoutTouchingTheDatabase(string message)
    {
        var response = await AskAsync(message);

        Assert.Empty(Route(response));
        Assert.Contains("Hello", response.Reply);
    }

    [Fact]
    public async Task AProductNamedLikeAGreeting_IsStillSearched()
    {
        var response = await AskAsync("hifi speakers");

        Assert.Equal(new[] { "search_products" }, Route(response));
    }
}

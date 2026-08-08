using System.Linq.Expressions;
using Moq;
using Repository.Common.Interface;
using Repository.Entities;
using Service.Common.Mapper;
using Service.DTO;
using Service.Implementations;

namespace ECommerce.Tests;

/// <summary>
/// Covers the rule that makes the cart trustworthy: a cart can never hold more units
/// than the product has in stock, no matter how the client gets there.
/// </summary>
public class CartServiceTests
{
    private readonly Mock<IGenericRepository<Cart>> _carts = new();
    private readonly Mock<IGenericRepository<CartItem>> _items = new();
    private readonly Mock<IGenericRepository<Product>> _products = new();
    private readonly Mock<IGenericRepository<ProductVariant>> _variants = new();
    private readonly Mock<IGenericRepository<User>> _users = new();
    private readonly Mock<IGenericMapper> _mapper = new();

    private const int UserId = 7;

    private CartService CreateService() =>
        new(_carts.Object, _items.Object, _products.Object, _variants.Object, _mapper.Object, _users.Object);

    public CartServiceTests()
    {
        // These products are sold in a single form. Without this the variant lookup returns
        // null and every add fails on a NullReferenceException rather than the rule under test.
        _variants.Setup(r => r.FindGetAllAsync(It.IsAny<Expression<Func<ProductVariant, bool>>>()))
                 .ReturnsAsync(Array.Empty<ProductVariant>());
    }

    /// <summary>Wires up the reads BuildCartDtoAsync performs after a successful mutation.</summary>
    private void StubCartRead(Cart cart, params CartItem[] itemsInCart)
    {
        _items.Setup(r => r.FindGetAllAsync(It.IsAny<Expression<Func<CartItem, bool>>>()))
              .ReturnsAsync(itemsInCart);
        _products.Setup(r => r.FindGetAllAsync(It.IsAny<Expression<Func<Product, bool>>>()))
                 .ReturnsAsync(new[] { new Product { Id = 1, Name = "Keyboard", Price = 8900, Stock = 10 } });
        _users.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<User, bool>>>()))
              .ReturnsAsync(new User { Id = UserId, FullName = "Ali Khan" });
        _carts.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Cart, bool>>>()))
              .ReturnsAsync(cart);
    }

    [Fact]
    public async Task AddItem_WhenProductDoesNotExist_Throws()
    {
        _products.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Product?)null);

        var act = () => CreateService().AddItemAsync(UserId, new AddCartItemDto { ProductId = 99, Quantity = 1 });

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(act);
        Assert.Contains("not found", ex.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task AddItem_WhenProductIsInactive_Throws()
    {
        _products.Setup(r => r.GetByIdAsync(1))
                 .ReturnsAsync(new Product { Id = 1, Name = "Keyboard", Stock = 50, IsActive = false });

        var act = () => CreateService().AddItemAsync(UserId, new AddCartItemDto { ProductId = 1, Quantity = 1 });

        await Assert.ThrowsAsync<InvalidOperationException>(act);
    }

    [Fact]
    public async Task AddItem_WhenQuantityExceedsStock_ThrowsAndSavesNothing()
    {
        _products.Setup(r => r.GetByIdAsync(1))
                 .ReturnsAsync(new Product { Id = 1, Name = "Keyboard", Stock = 3, IsActive = true });
        _carts.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Cart, bool>>>()))
              .ReturnsAsync(new Cart { Id = 5, UserId = UserId });
        _items.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<CartItem, bool>>>()))
              .ReturnsAsync((CartItem?)null);

        var act = () => CreateService().AddItemAsync(UserId, new AddCartItemDto { ProductId = 1, Quantity = 4 });

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(act);
        Assert.Contains("Only 3 unit(s)", ex.Message);
        _items.Verify(r => r.AddAsync(It.IsAny<CartItem>()), Times.Never);
        _items.Verify(r => r.SaveChangesAsync(), Times.Never);
    }

    /// <summary>
    /// The case a naive check misses: each request is under stock on its own, but the
    /// cart already holds units, so the merged quantity is what has to be validated.
    /// </summary>
    [Fact]
    public async Task AddItem_WhenExistingQuantityPushesTotalOverStock_Throws()
    {
        _products.Setup(r => r.GetByIdAsync(1))
                 .ReturnsAsync(new Product { Id = 1, Name = "Keyboard", Stock = 5, IsActive = true });
        _carts.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Cart, bool>>>()))
              .ReturnsAsync(new Cart { Id = 5, UserId = UserId });
        _items.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<CartItem, bool>>>()))
              .ReturnsAsync(new CartItem { Id = 11, CartId = 5, ProductId = 1, Quantity = 4 });

        // 4 already in the cart + 2 more = 6, which is over the 5 in stock.
        var act = () => CreateService().AddItemAsync(UserId, new AddCartItemDto { ProductId = 1, Quantity = 2 });

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(act);
        Assert.Contains("Only 5 unit(s)", ex.Message);
        _items.Verify(r => r.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task AddItem_WhenExactlyAtStock_IsAllowed()
    {
        var cart = new Cart { Id = 5, UserId = UserId };
        _products.Setup(r => r.GetByIdAsync(1))
                 .ReturnsAsync(new Product { Id = 1, Name = "Keyboard", Price = 8900, Stock = 5, IsActive = true });
        _items.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<CartItem, bool>>>()))
              .ReturnsAsync((CartItem?)null);
        StubCartRead(cart, new CartItem { Id = 11, CartId = 5, ProductId = 1, Quantity = 5 });

        var result = await CreateService().AddItemAsync(UserId, new AddCartItemDto { ProductId = 1, Quantity = 5 });

        _items.Verify(r => r.AddAsync(It.Is<CartItem>(i => i.Quantity == 5 && i.ProductId == 1)), Times.Once);
        Assert.Equal(5 * 8900m, result.TotalAmount);
    }

    [Fact]
    public async Task AddItem_WhenUserHasNoCart_CreatesOneFirst()
    {
        var created = new Cart { Id = 5, UserId = UserId };
        _products.Setup(r => r.GetByIdAsync(1))
                 .ReturnsAsync(new Product { Id = 1, Name = "Keyboard", Price = 8900, Stock = 10, IsActive = true });
        _carts.SetupSequence(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Cart, bool>>>()))
              .ReturnsAsync((Cart?)null)      // no cart on the first look
              .ReturnsAsync(created);
        _items.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<CartItem, bool>>>()))
              .ReturnsAsync((CartItem?)null);
        _items.Setup(r => r.FindGetAllAsync(It.IsAny<Expression<Func<CartItem, bool>>>()))
              .ReturnsAsync(new[] { new CartItem { Id = 11, CartId = 5, ProductId = 1, Quantity = 1 } });
        _products.Setup(r => r.FindGetAllAsync(It.IsAny<Expression<Func<Product, bool>>>()))
                 .ReturnsAsync(new[] { new Product { Id = 1, Name = "Keyboard", Price = 8900 } });
        _users.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<User, bool>>>()))
              .ReturnsAsync(new User { Id = UserId, FullName = "Ali Khan" });

        await CreateService().AddItemAsync(UserId, new AddCartItemDto { ProductId = 1, Quantity = 1 });

        _carts.Verify(r => r.AddAsync(It.Is<Cart>(c => c.UserId == UserId)), Times.Once);
    }

    [Fact]
    public async Task UpdateItem_WhenNewQuantityExceedsStock_Throws()
    {
        _carts.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Cart, bool>>>()))
              .ReturnsAsync(new Cart { Id = 5, UserId = UserId });
        _items.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<CartItem, bool>>>()))
              .ReturnsAsync(new CartItem { Id = 11, CartId = 5, ProductId = 1, Quantity = 1 });
        _products.Setup(r => r.GetByIdAsync(1))
                 .ReturnsAsync(new Product { Id = 1, Name = "Keyboard", Stock = 2, IsActive = true });

        var act = () => CreateService().UpdateItemAsync(UserId, new UpdateCartItemDto { CartItemId = 11, Quantity = 9 });

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(act);
        Assert.Contains("Only 2 unit(s)", ex.Message);
        _items.Verify(r => r.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task GetCart_WhenUserHasNoCart_ReturnsEmptyCartRatherThanThrowing()
    {
        _carts.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Cart, bool>>>()))
              .ReturnsAsync((Cart?)null);

        var cart = await CreateService().GetCartAsync(UserId);

        Assert.Empty(cart.Items);
        Assert.Equal(0, cart.TotalAmount);
        Assert.Equal(UserId, cart.UserId);
    }
}

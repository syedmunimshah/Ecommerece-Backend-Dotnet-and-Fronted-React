using System.Linq.Expressions;
using Moq;
using Repository.Common.Interface;
using Repository.Entities;
using Service.Common.Mapper;
using Service.DTO;
using Service.Implementations;

namespace ECommerce.Tests;

/// <summary>
/// Covers the rules that keep a cart with options coherent: you cannot buy a product that
/// only exists in options without picking one, you cannot pick one for a product that has
/// none, and stock is checked against the option rather than the product.
/// </summary>
public class CartVariantTests
{
    private const int UserId = 7;
    private const int ProductId = 1;

    private readonly Mock<IGenericRepository<Cart>> _carts = new();
    private readonly Mock<IGenericRepository<CartItem>> _items = new();
    private readonly Mock<IGenericRepository<Product>> _products = new();
    private readonly Mock<IGenericRepository<ProductVariant>> _variants = new();
    private readonly Mock<IGenericRepository<User>> _users = new();
    private readonly Mock<IGenericMapper> _mapper = new();

    private static readonly Product Shirt =
        new() { Id = ProductId, Name = "Cotton Shirt", Price = 2500, Stock = 0, IsActive = true };

    private static readonly ProductVariant Medium =
        new() { Id = 10, ProductId = ProductId, Name = "M", Price = 2500, Stock = 4, IsActive = true, SortOrder = 2 };

    private static readonly ProductVariant Large =
        new() { Id = 11, ProductId = ProductId, Name = "L", Price = 2700, Stock = 2, IsActive = true, SortOrder = 3 };

    private CartService CreateService() =>
        new(_carts.Object, _items.Object, _products.Object, _variants.Object, _mapper.Object, _users.Object);

    /// <summary>Sets up a product sold in the given options, with an existing empty cart.</summary>
    private void GivenProductWith(params ProductVariant[] variants)
    {
        _products.Setup(r => r.GetByIdAsync(ProductId)).ReturnsAsync(Shirt);
        _variants.Setup(r => r.FindGetAllAsync(It.IsAny<Expression<Func<ProductVariant, bool>>>()))
                 .ReturnsAsync(variants);
        _carts.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<Cart, bool>>>()))
              .ReturnsAsync(new Cart { Id = 1, UserId = UserId });
        _items.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<CartItem, bool>>>()))
              .ReturnsAsync((CartItem?)null);
        _items.Setup(r => r.FindGetAllAsync(It.IsAny<Expression<Func<CartItem, bool>>>()))
              .ReturnsAsync(Array.Empty<CartItem>());
        _users.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<User, bool>>>()))
              .ReturnsAsync(new User { Id = UserId, FullName = "Ali Khan" });
    }

    [Fact]
    public async Task AddingAProductWithOptions_WithoutChoosingOne_Throws()
    {
        GivenProductWith(Medium, Large);

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            CreateService().AddItemAsync(UserId, new AddCartItemDto { ProductId = ProductId, Quantity = 1 }));

        // The message lists what is available so the customer can act on it.
        Assert.Contains("Choose an option", ex.Message);
        Assert.Contains("M", ex.Message);
        _items.Verify(r => r.AddAsync(It.IsAny<CartItem>()), Times.Never);
    }

    [Fact]
    public async Task ChoosingAnOption_ForAProductThatHasNone_Throws()
    {
        GivenProductWith();

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            CreateService().AddItemAsync(UserId,
                new AddCartItemDto { ProductId = ProductId, Quantity = 1, ProductVariantId = 99 }));

        Assert.Contains("not sold in options", ex.Message);
    }

    /// <summary>
    /// The point of per-option stock: 2 larges left must not be satisfied by the 4 mediums.
    /// </summary>
    [Fact]
    public async Task StockIsCheckedAgainstTheChosenOption_NotTheProduct()
    {
        GivenProductWith(Medium, Large);

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            CreateService().AddItemAsync(UserId,
                new AddCartItemDto { ProductId = ProductId, Quantity = 3, ProductVariantId = Large.Id }));

        Assert.Contains("Only 2 unit(s)", ex.Message);
        Assert.Contains("(L)", ex.Message);
    }

    [Fact]
    public async Task AnOptionWithinStock_IsAddedAgainstThatOption()
    {
        GivenProductWith(Medium, Large);
        CartItem? added = null;
        _items.Setup(r => r.AddAsync(It.IsAny<CartItem>()))
              .Callback<CartItem>(i => added = i)
              .Returns(Task.CompletedTask);

        await CreateService().AddItemAsync(UserId,
            new AddCartItemDto { ProductId = ProductId, Quantity = 2, ProductVariantId = Large.Id });

        Assert.NotNull(added);
        Assert.Equal(Large.Id, added!.ProductVariantId);
        Assert.Equal(2, added.Quantity);
    }

    [Fact]
    public async Task AnOptionTheSellerDeactivated_IsRejected()
    {
        // ResolveVariantAsync only ever loads active options, so a deactivated one simply is
        // not in the set — the customer is told it is gone rather than silently getting it.
        GivenProductWith(Medium);

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            CreateService().AddItemAsync(UserId,
                new AddCartItemDto { ProductId = ProductId, Quantity = 1, ProductVariantId = Large.Id }));

        Assert.Contains("no longer available", ex.Message);
    }
}

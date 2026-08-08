using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Repository.Common.Interface;
using Repository.Entities;
using Service.Common.Mapper;
using Service.DTO;
using Service.Interfaces;

namespace Service.Implementations
{
    public class CartService : ICartService
    {
        private readonly IGenericRepository<Cart> _cartRepo;
        private readonly IGenericRepository<CartItem> _cartItemRepo;
        private readonly IGenericRepository<Product> _productRepo;
        private readonly IGenericRepository<ProductVariant> _variantRepo;
        private readonly IGenericRepository<User> _user;
        private readonly IGenericMapper _mapper;

        public CartService(
            IGenericRepository<Cart> cartRepo,
            IGenericRepository<CartItem> cartItemRepo,
            IGenericRepository<Product> productRepo,
            IGenericRepository<ProductVariant> variantRepo,
            IGenericMapper mapper,
            IGenericRepository<User> user)
        {
            _cartRepo = cartRepo;
            _cartItemRepo = cartItemRepo;
            _productRepo = productRepo;
            _variantRepo = variantRepo;
            _mapper = mapper;
            _user = user;
        }

        public async Task<CartDto> AddItemAsync(int userId, AddCartItemDto dto)
        {
            var product = await _productRepo.GetByIdAsync(dto.ProductId);
            if (product == null || !product.IsActive)
            {
                throw new InvalidOperationException("Product not found or inactive.");
            }

            var cart = await _cartRepo.FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    CreatedDate = DateTime.UtcNow
                };
                await _cartRepo.AddAsync(cart);
                await _cartRepo.SaveChangesAsync();
            }

            var variant = await ResolveVariantAsync(product, dto.ProductVariantId);

            // Each option is its own line: two sizes of the same shirt must not merge, or one
            // would silently overwrite the other's quantity and stock check.
            var existingItem = await _cartItemRepo.FirstOrDefaultAsync(ci =>
                ci.CartId == cart.Id
                && ci.ProductId == dto.ProductId
                && ci.ProductVariantId == dto.ProductVariantId);

            // Don't let the cart hold more than what's in stock (add merges with any existing qty).
            // Stock lives on the variant when there is one — running out of M says nothing about L.
            var availableStock = variant?.Stock ?? product.Stock;
            var label = variant == null ? product.Name : $"{product.Name} ({variant.Name})";
            var resultingQty = (existingItem?.Quantity ?? 0) + dto.Quantity;
            if (availableStock < resultingQty)
            {
                throw new InvalidOperationException($"Only {availableStock} unit(s) of '{label}' in stock.");
            }

            if (existingItem == null)
            {
                var item = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = dto.ProductId,
                    ProductVariantId = variant?.Id,
                    Quantity = dto.Quantity,
                    CreatedDate = DateTime.UtcNow
                };
                await _cartItemRepo.AddAsync(item);
            }
            else
            {
                existingItem.Quantity += dto.Quantity;
                existingItem.UpdateDate = DateTime.UtcNow;
                _cartItemRepo.Update(existingItem);
            }

            await _cartItemRepo.SaveChangesAsync();
            return await BuildCartDtoAsync(cart.Id, userId);
        }

        public async Task<CartDto> GetCartAsync(int userId)
        {
            var cart = await _cartRepo.FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null)
            {
                return new CartDto
                {
                    UserId = userId,
                    Items = Array.Empty<CartItemDto>(),
                    TotalAmount = 0
                };
            }
            return await BuildCartDtoAsync(cart.Id, userId);
        }

        public async Task<CartDto> UpdateItemAsync(int userId, UpdateCartItemDto dto)
        {
            var cart = await _cartRepo.FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null)
            {
                throw new InvalidOperationException("Cart not found.");
            }

            var item = await _cartItemRepo.FirstOrDefaultAsync(ci => ci.Id == dto.CartItemId && ci.CartId == cart.Id);
            if (item == null)
            {
                throw new InvalidOperationException("Cart item not found.");
            }

            var product = await _productRepo.GetByIdAsync(item.ProductId);
            var variant = item.ProductVariantId.HasValue
                ? await _variantRepo.GetByIdAsync(item.ProductVariantId.Value)
                : null;

            // Check against the option actually in the cart, not the product total — otherwise a
            // customer could raise the quantity of size M up to the combined stock of every size.
            var availableStock = variant?.Stock ?? product?.Stock;
            if (availableStock.HasValue && availableStock.Value < dto.Quantity)
            {
                var label = variant == null
                    ? product?.Name
                    : $"{product?.Name} ({variant.Name})";
                throw new InvalidOperationException($"Only {availableStock.Value} unit(s) of '{label}' in stock.");
            }

            item.Quantity = dto.Quantity;
            item.UpdateDate = DateTime.UtcNow;
            _cartItemRepo.Update(item);
            await _cartItemRepo.SaveChangesAsync();

            return await BuildCartDtoAsync(cart.Id, userId);
        }

        public async Task<CartDto> RemoveItemAsync(int userId, int cartItemId)
        {
            var cart = await _cartRepo.FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null)
            {
                throw new InvalidOperationException("Cart not found.");
            }

            var item = await _cartItemRepo.FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.CartId == cart.Id);
            if (item != null)
            {
                _cartItemRepo.Delete(item);
                await _cartItemRepo.SaveChangesAsync();
            }

            return await BuildCartDtoAsync(cart.Id, userId);
        }

        /// <summary>
        /// Pairs a product with the option the customer chose, and rejects the two ways that
        /// pairing can be wrong: picking no option for a product that only exists in options,
        /// and picking one for a product that has none. Letting either through would put a row
        /// in the cart whose price and stock cannot be resolved.
        /// </summary>
        private async Task<ProductVariant?> ResolveVariantAsync(Product product, int? variantId)
        {
            var activeVariants = (await _variantRepo.FindGetAllAsync(
                v => v.ProductId == product.Id && v.IsActive)).ToList();

            if (activeVariants.Count == 0)
            {
                if (variantId.HasValue)
                {
                    throw new InvalidOperationException($"'{product.Name}' is not sold in options.");
                }
                return null;
            }

            if (!variantId.HasValue)
            {
                var names = string.Join(", ", activeVariants.OrderBy(v => v.SortOrder).Select(v => v.Name));
                throw new InvalidOperationException($"Choose an option for '{product.Name}': {names}.");
            }

            return activeVariants.FirstOrDefault(v => v.Id == variantId.Value)
                ?? throw new InvalidOperationException("That option is no longer available.");
        }

        private async Task<CartDto> BuildCartDtoAsync(int cartId, int userId)
        {
            var cartItem = (await _cartItemRepo.FindGetAllAsync(ci => ci.CartId == cartId)).ToList();
            // Fetch only the products referenced by the cart (not the whole table).
            var productIds = cartItem.Select(ci => ci.ProductId).Distinct().ToList();
            var products = (await _productRepo.FindGetAllAsync(p => productIds.Contains(p.Id)))
                .ToDictionary(p => p.Id);
            var user = await _user.FirstOrDefaultAsync(u => u.Id == userId);
            var userName = user?.FullName ?? string.Empty;
            // Variants referenced by the cart, so each line prices from its own option.
            var variantIds = cartItem.Where(ci => ci.ProductVariantId.HasValue)
                                     .Select(ci => ci.ProductVariantId!.Value)
                                     .Distinct().ToList();
            var variants = variantIds.Count == 0
                ? new Dictionary<int, ProductVariant>()
                : (await _variantRepo.FindGetAllAsync(v => variantIds.Contains(v.Id)))
                    .ToDictionary(v => v.Id);

            var itemDtos = cartItem.Select(ci =>
            {
                var product = products.GetValueOrDefault(ci.ProductId);
                var variant = ci.ProductVariantId.HasValue
                    ? variants.GetValueOrDefault(ci.ProductVariantId.Value)
                    : null;

                return new CartItemDto
                {
                    Id = ci.Id,
                    ProductId = ci.ProductId,
                    ProductName = product?.Name ?? string.Empty,
                    ProductVariantId = ci.ProductVariantId,
                    VariantName = variant?.Name,
                    Quantity = ci.Quantity,
                    // The variant's price is what the customer pays; the product's is only a
                    // display figure once options exist.
                    Price = variant?.Price ?? product?.Price ?? 0
                };
            }).ToList();

            var total = itemDtos.Sum(i => i.Price * i.Quantity);

            return new CartDto
            {
                Id = cartId,
                UserId = userId,
                UserName= userName,
                Items = itemDtos,
                TotalAmount = total
            };
        }
    }
}


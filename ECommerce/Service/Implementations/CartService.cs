using System;
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
        private readonly IGenericRepository<User> _user;
        private readonly IGenericMapper _mapper;

        public CartService(
            IGenericRepository<Cart> cartRepo,
            IGenericRepository<CartItem> cartItemRepo,
            IGenericRepository<Product> productRepo,
            IGenericMapper mapper,
            IGenericRepository<User> user)
        {
            _cartRepo = cartRepo;
            _cartItemRepo = cartItemRepo;
            _productRepo = productRepo;
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

            var existingItem = await _cartItemRepo.FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.ProductId == dto.ProductId);
            if (existingItem == null)
            {
                var item = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = dto.ProductId,
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

        private async Task<CartDto> BuildCartDtoAsync(int cartId, int userId)
        {
            var cartItem = await _cartItemRepo.FindGetAllAsync(ci => ci.CartId == cartId);
            var allProducts = await _productRepo.GetAllAsync();
            var user =await  _user.FirstOrDefaultAsync(u => u.Id == userId);
            var userName = user?.FullName??string.Empty;
            var itemDtos = cartItem.Select(ci =>
            {

                var product = allProducts.FirstOrDefault(p => p.Id == ci.ProductId);
                var price = product?.Price ?? 0;
                return new CartItemDto
                {
                    Id = ci.Id,
                    ProductId = ci.ProductId,
                    ProductName = product?.Name ?? string.Empty,
                    Quantity = ci.Quantity,
                    Price = price
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


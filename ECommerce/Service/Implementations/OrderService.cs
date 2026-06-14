using System;
using System.Linq;
using System.Threading.Tasks;
using Repository.Common.Dto;
using Repository.Common.Interface;
using Repository.Entities;
using Service.Common.Mapper;
using Service.Component;
using Service.DTO;
using Service.Interfaces;

namespace Service.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IGenericRepository<Order> _orderRepo;
        private readonly IGenericRepository<OrderItem> _orderItemRepo;
        private readonly IGenericRepository<Cart> _cartRepo;
        private readonly IGenericRepository<CartItem> _cartItemRepo;
        private readonly IGenericRepository<Product> _productRepo;
        private readonly IGenericRepository<SellerProfile> _sellerProfileRepo;
        private readonly IGenericMapper _mapper;

        public OrderService(
            IGenericRepository<Order> orderRepo,
            IGenericRepository<OrderItem> orderItemRepo,
            IGenericRepository<Cart> cartRepo,
            IGenericRepository<CartItem> cartItemRepo,
            IGenericRepository<Product> productRepo,
            IGenericRepository<SellerProfile> sellerProfileRepo,
            IGenericMapper mapper)
        {
            _orderRepo = orderRepo;
            _orderItemRepo = orderItemRepo;
            _cartRepo = cartRepo;
            _cartItemRepo = cartItemRepo;
            _productRepo = productRepo;
            _sellerProfileRepo = sellerProfileRepo;
            _mapper = mapper;
        }

        public async Task<OrderDto> CreateOrderFromCartAsync(int userId)
        {
            var cart = await _cartRepo.FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null)
            {
                throw new InvalidOperationException("Cart not found.");
            }

            var cartItems = await _cartItemRepo.FindGetAllAsync(ci => ci.CartId == cart.Id);
            if (!cartItems.Any())
            {
                throw new InvalidOperationException("Cart is empty.");
            }

            var products = await _productRepo.GetAllAsync();
            decimal totalAmount = 0;

            foreach (var ci in cartItems)
            {
                var product = products.FirstOrDefault(p => p.Id == ci.ProductId);
                if (product == null)
                {
                    throw new InvalidOperationException("Product not found for cart item.");
                }
                totalAmount += product.Price * ci.Quantity;
            }

            var order = new Order
            {
                UserId = userId,
                TotalAmount = totalAmount,
                Status = "Pending",
                CreatedDate = DateTime.UtcNow
            };
            await _orderRepo.AddAsync(order);
            await _orderRepo.SaveChangesAsync();

            foreach (var ci in cartItems)
            {
                var product = products.FirstOrDefault(p => p.Id == ci.ProductId);
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity,
                    Price = product.Price,
                    CreatedDate = DateTime.UtcNow
                };
                await _orderItemRepo.AddAsync(orderItem);
            }
            await _orderItemRepo.SaveChangesAsync();

            foreach (var ci in cartItems)
            {
                _cartItemRepo.Delete(ci);
            }
            await _cartItemRepo.SaveChangesAsync();

            return await ProjectOrderAsync(order);
        }

        public async Task<PagedResponse<OrderDto>> GetOrdersForUserAsync(int userId, PagedRequest request)
        {
            var paged = await _orderRepo.GetPagedAsync(request);
            var data = paged.Data.Where(o => o.UserId == userId).ToList();
            var dtoData = await ProjectOrdersAsync(data);
            return new PagedResponse<OrderDto>
            {
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = dtoData.Count,
                Data = dtoData
            };
        }

        public async Task<PagedResponse<OrderDto>> GetOrdersForSellerAsync(int sellerUserId, PagedRequest request)
        {
            var seller = await _sellerProfileRepo.FirstOrDefaultAsync(s => s.UserId == sellerUserId && s.Status==Convert.ToInt32(SellerStatus.Approved) && s.IsActive);
            if (seller == null)
            {
                throw new InvalidOperationException("Seller profile not approved.");
            }

            var paged = await _orderRepo.GetPagedAsync(request);
            var orders = paged.Data.Where(o => o.OrderItems.Any(oi => oi.Product.SellerId == seller.Id)).ToList();
            var dtoData = await ProjectOrdersAsync(orders);
            return new PagedResponse<OrderDto>
            {
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = dtoData.Count,
                Data = dtoData
            };
        }

        public async Task<PagedResponse<OrderDto>> GetAllOrdersAsync(PagedRequest request)
        {
            var paged = await _orderRepo.GetPagedAsync(request);
            var dtoData = await ProjectOrdersAsync(paged.Data.ToList());
            return new PagedResponse<OrderDto>
            {
                PageNumber = paged.PageNumber,
                PageSize = paged.PageSize,
                TotalRecords = paged.TotalRecords,
                Data = dtoData
            };
        }

        public async Task<OrderDto?> GetByIdAsync(int id, int requestingUserId, string role)
        {
            var order = await _orderRepo.GetByIdAsync(id);
            if (order == null)
            {
                return null;
            }

            if (string.Equals(role, "User", StringComparison.OrdinalIgnoreCase) && order.UserId != requestingUserId)
            {
                return null;
            }

            if (string.Equals(role, "Seller", StringComparison.OrdinalIgnoreCase))
            {
                var seller = await _sellerProfileRepo.FirstOrDefaultAsync(s => s.UserId == requestingUserId && s.Status == Convert.ToInt32(SellerStatus.Approved) && s.IsActive);
                if (seller == null || !order.OrderItems.Any(oi => oi.Product.SellerId == seller.Id))
                {
                    return null;
                }
            }

            return await ProjectOrderAsync(order);
        }

        private async Task<OrderDto> ProjectOrderAsync(Order order)
        {
            var items = await _orderItemRepo.FindGetAllAsync(oi => oi.OrderId == order.Id);
            var itemDtos = items.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product?.Name ?? string.Empty,
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList();

            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                CreatedDate = order.CreatedDate,
                Items = itemDtos
            };
        }

        private async Task<List<OrderDto>> ProjectOrdersAsync(List<Order> orders)
        {
            var result = new List<OrderDto>();
            foreach (var o in orders)
            {
                result.Add(await ProjectOrderAsync(o));
            }
            return result;
        }
    }
}


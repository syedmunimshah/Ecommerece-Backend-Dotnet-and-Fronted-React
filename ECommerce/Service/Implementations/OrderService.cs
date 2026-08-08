using System;
using System.Collections.Generic;
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
        private readonly IGenericRepository<ProductVariant> _variantRepo;
        private readonly IGenericRepository<SellerProfile> _sellerProfileRepo;
        private readonly IGenericRepository<OrderTracking> _orderTrackingRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericMapper _mapper;

        public OrderService(
            IGenericRepository<Order> orderRepo,
            IGenericRepository<OrderItem> orderItemRepo,
            IGenericRepository<Cart> cartRepo,
            IGenericRepository<CartItem> cartItemRepo,
            IGenericRepository<Product> productRepo,
            IGenericRepository<ProductVariant> variantRepo,
            IGenericRepository<SellerProfile> sellerProfileRepo,
            IGenericRepository<OrderTracking> orderTrackingRepo,
            IUnitOfWork unitOfWork,
            IGenericMapper mapper)
        {
            _orderRepo = orderRepo;
            _orderItemRepo = orderItemRepo;
            _cartRepo = cartRepo;
            _cartItemRepo = cartItemRepo;
            _productRepo = productRepo;
            _variantRepo = variantRepo;
            _sellerProfileRepo = sellerProfileRepo;
            _orderTrackingRepo = orderTrackingRepo;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<OrderDto> CreateOrderFromCartAsync(int userId, CreateOrderDto dto)
        {
            var address = dto?.ShippingAddress
                ?? throw new InvalidOperationException("A delivery address is required.");

            var cart = await _cartRepo.FirstOrDefaultAsync(c => c.UserId == userId)
                ?? throw new InvalidOperationException("Cart not found.");

            var cartItems = (await _cartItemRepo.FindGetAllAsync(ci => ci.CartId == cart.Id)).ToList();
            if (cartItems.Count == 0)
            {
                throw new InvalidOperationException("Cart is empty.");
            }

            // Fetch only the products referenced by the cart (targeted query, not the whole table).
            var productIds = cartItems.Select(ci => ci.ProductId).Distinct().ToList();
            var products = (await _productRepo.FindGetAllAsync(p => productIds.Contains(p.Id)))
                .ToDictionary(p => p.Id);

            // Options referenced by the cart. Price and stock come from the chosen option when
            // there is one, so an order for size M can never be paid for or decremented at the
            // product's own figures.
            var variantIds = cartItems.Where(ci => ci.ProductVariantId.HasValue)
                                      .Select(ci => ci.ProductVariantId!.Value)
                                      .Distinct().ToList();
            var variants = variantIds.Count == 0
                ? new Dictionary<int, ProductVariant>()
                : (await _variantRepo.FindGetAllAsync(v => variantIds.Contains(v.Id)))
                    .ToDictionary(v => v.Id);

            // Validate availability + stock and compute the server-side total BEFORE writing anything.
            decimal totalAmount = 0;
            foreach (var ci in cartItems)
            {
                if (!products.TryGetValue(ci.ProductId, out var product))
                {
                    throw new InvalidOperationException("Product not found for cart item.");
                }
                if (!product.IsActive)
                {
                    throw new InvalidOperationException($"Product '{product.Name}' is no longer available.");
                }

                ProductVariant? variant = null;
                if (ci.ProductVariantId.HasValue
                    && !variants.TryGetValue(ci.ProductVariantId.Value, out variant))
                {
                    throw new InvalidOperationException(
                        $"An option of '{product.Name}' is no longer available. Please review your cart.");
                }
                if (variant is { IsActive: false })
                {
                    throw new InvalidOperationException(
                        $"'{product.Name} ({variant.Name})' is no longer available.");
                }

                var label = variant == null ? product.Name : $"{product.Name} ({variant.Name})";
                var available = variant?.Stock ?? product.Stock;
                if (available < ci.Quantity)
                {
                    throw new InvalidOperationException(
                        $"Insufficient stock for '{label}'. Available: {available}, requested: {ci.Quantity}.");
                }

                totalAmount += (variant?.Price ?? product.Price) * ci.Quantity;
            }

            // Order creation, stock decrement and cart clearing must be atomic.
            await using var transaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                var order = new Order
                {
                    UserId = userId,
                    TotalAmount = totalAmount,
                    Status = "Pending",
                    CreatedDate = DateTime.UtcNow,
                    ShippingName = address.Name?.Trim(),
                    ShippingPhone = address.Phone?.Trim(),
                    ShippingAddress = address.Address?.Trim(),
                    ShippingCity = address.City?.Trim(),
                    ShippingPostalCode = string.IsNullOrWhiteSpace(address.PostalCode)
                        ? null : address.PostalCode.Trim(),
                    ShippingNotes = string.IsNullOrWhiteSpace(address.Notes)
                        ? null : address.Notes.Trim(),
                };
                await _orderRepo.AddAsync(order);
                await _unitOfWork.SaveChangesAsync(); // materialize order.Id

                foreach (var ci in cartItems)
                {
                    var product = products[ci.ProductId];
                    var variant = ci.ProductVariantId.HasValue
                        ? variants[ci.ProductVariantId.Value]
                        : null;

                    await _orderItemRepo.AddAsync(new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = ci.ProductId,
                        ProductVariantId = variant?.Id,
                        // Copied, not looked up later: renaming "Large" to "XL" next month must
                        // not rewrite what this customer actually bought.
                        VariantName = variant?.Name,
                        Quantity = ci.Quantity,
                        Price = variant?.Price ?? product.Price,
                        CreatedDate = DateTime.UtcNow
                    });

                    if (variant != null)
                    {
                        variant.Stock -= ci.Quantity;
                        _variantRepo.Update(variant);
                    }
                    else
                    {
                        product.Stock -= ci.Quantity;
                        _productRepo.Update(product);
                    }

                    _cartItemRepo.Delete(ci);
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                return await ProjectOrderAsync(order);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<PagedResponse<OrderDto>> GetOrdersForUserAsync(int userId, PagedRequest request)
        {
            var paged = await _orderRepo.GetPagedAsync(request, o => o.UserId == userId);
            var dtoData = await ProjectOrdersAsync(paged.Data.ToList());
            return new PagedResponse<OrderDto>
            {
                PageNumber = paged.PageNumber,
                PageSize = paged.PageSize,
                TotalRecords = paged.TotalRecords,
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

            var sellerProductIds = (await _productRepo.FindGetAllAsync(p => p.SellerId == seller.Id))
                .Select(p => p.Id)
                .ToList();

            if (sellerProductIds.Count == 0)
            {
                return EmptyPagedOrders(request);
            }

            var orderIds = (await _orderItemRepo.FindGetAllAsync(oi => sellerProductIds.Contains(oi.ProductId)))
                .Select(oi => oi.OrderId)
                .Distinct()
                .ToList();

            if (orderIds.Count == 0)
            {
                return EmptyPagedOrders(request);
            }

            var orders = (await _orderRepo.FindGetAllAsync(o => orderIds.Contains(o.Id)))
                .OrderByDescending(o => o.CreatedDate ?? DateTime.MinValue)
                .ToList();

            var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
            var pageSize = request.PageSize < 1 ? 10 : request.PageSize;
            var pagedOrders = orders
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var dtoData = await ProjectOrdersAsync(pagedOrders);
            return new PagedResponse<OrderDto>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = orders.Count,
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
                if (seller == null)
                {
                    return null;
                }

                var items = await _orderItemRepo.FindGetAllAsync(oi => oi.OrderId == id);
                var productIds = items.Select(i => i.ProductId).ToList();
                if (productIds.Count == 0)
                {
                    return null;
                }

                var products = await _productRepo.FindGetAllAsync(p => productIds.Contains(p.Id));
                if (!products.Any(p => p.SellerId == seller.Id))
                {
                    return null;
                }
            }

            return await ProjectOrderAsync(order);
        }

        public async Task<OrderDto?> UpdateStatusAsync(int orderId, UpdateOrderStatusDto dto, int userId, string role)
        {
            var order = await _orderRepo.GetByIdAsync(orderId);
            if (order == null)
                return null;

            if (string.Equals(role, "Seller", StringComparison.OrdinalIgnoreCase))
            {
                var seller = await _sellerProfileRepo.FirstOrDefaultAsync(s =>
                    s.UserId == userId && s.Status == Convert.ToInt32(SellerStatus.Approved) && s.IsActive);
                if (seller == null)
                    return null;

                var items = await _orderItemRepo.FindGetAllAsync(oi => oi.OrderId == orderId);
                var productIds = items.Select(i => i.ProductId).ToList();
                var products = (await _productRepo.FindGetAllAsync(p => productIds.Contains(p.Id))).ToList();
                if (!products.Any(p => p.SellerId == seller.Id))
                    return null;
            }
            else if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }

            order.Status = dto.Status.Trim();
            order.UpdateDate = DateTime.UtcNow;
            order.UpdateBy = userId;
            _orderRepo.Update(order);

            await _orderTrackingRepo.AddAsync(new OrderTracking
            {
                OrderId = orderId,
                Status = order.Status,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = userId,
            });

            await _orderRepo.SaveChangesAsync();
            await _orderTrackingRepo.SaveChangesAsync();

            return await ProjectOrderAsync(order);
        }

        private static PagedResponse<OrderDto> EmptyPagedOrders(PagedRequest request)
        {
            var pageNumber = request.PageNumber < 1 ? 1 : request.PageNumber;
            var pageSize = request.PageSize < 1 ? 10 : request.PageSize;
            return new PagedResponse<OrderDto>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = 0,
                Data = new List<OrderDto>()
            };
        }

        private async Task<OrderDto> ProjectOrderAsync(Order order)
        {
            var items = (await _orderItemRepo.FindGetAllAsync(oi => oi.OrderId == order.Id)).ToList();
            var productIds = items.Select(i => i.ProductId).Distinct().ToList();
            var products = (await _productRepo.FindGetAllAsync(p => productIds.Contains(p.Id)))
                .ToDictionary(p => p.Id, p => p.Name);

            var itemDtos = items.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = products.GetValueOrDefault(oi.ProductId) ?? string.Empty,
                ProductVariantId = oi.ProductVariantId,
                VariantName = oi.VariantName,
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
                Items = itemDtos,
                // Null for orders placed before addresses were collected, so the UI can fall
                // back rather than render an empty address block.
                ShippingAddress = order.ShippingAddress is null ? null : new ShippingAddressDto
                {
                    Name = order.ShippingName ?? string.Empty,
                    Phone = order.ShippingPhone ?? string.Empty,
                    Address = order.ShippingAddress,
                    City = order.ShippingCity ?? string.Empty,
                    PostalCode = order.ShippingPostalCode,
                    Notes = order.ShippingNotes,
                }
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


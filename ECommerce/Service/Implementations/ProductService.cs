using Repository.Common.Dto;
using Repository.Common.Interface;
using Repository.Entities;
using Repository.Interfaces;
using Service.Common.Mapper;
using Service.Component;
using Service.DTO;
using Service.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Service.Implementations
{
    public class ProductService : IProductService
    {
        private readonly IGenericRepository<Product> _productRepo;
        private readonly IGenericRepository<SellerProfile> _sellerProfileRepo;
        private readonly IGenericRepository<Category> _categoryRepo;
        private readonly IGenericRepository<ProductVariant> _variantRepo;
        private readonly IProductRepository _productRepository;
        private readonly IGenericMapper _mapper;

        public ProductService(
            IGenericRepository<Product> productRepo,
            IGenericRepository<SellerProfile> sellerProfileRepo,
            IGenericRepository<Category> categoryRepo,
            IGenericRepository<ProductVariant> variantRepo,
            IGenericMapper mapper,
            IProductRepository productRepository
            )
        {
            _productRepo = productRepo;
            _sellerProfileRepo = sellerProfileRepo;
            _categoryRepo = categoryRepo;
            _variantRepo = variantRepo;
            _mapper = mapper;
            _productRepository = productRepository;
        }

        public async Task<ProductDto> CreateProductAsync(int sellerUserId, CreateProductDto dto)
        {
            var seller = await _sellerProfileRepo.FirstOrDefaultAsync(s => s.UserId == sellerUserId && s.IsActive && s.Status==(int)SellerStatus.Approved);
            if (seller == null)
            {
                throw new InvalidOperationException("Seller profile is not approved or does not exist.");
            }

            if (dto.CategoryId.HasValue)
            {
                var exists = await _categoryRepo.AnyAsync(c => c.Id == dto.CategoryId.Value && c.IsActive);
                if (!exists)
                {
                    throw new InvalidOperationException("Category does not exist or is inactive.");
                }
            }

            var entity = _mapper.Map<CreateProductDto, Product>(dto);
            entity.SellerId = seller.Id;
            entity.IsActive = true;
            entity.CreatedDate = DateTime.UtcNow;
            await _productRepo.AddAsync(entity);
            await _productRepo.SaveChangesAsync();

            await SyncVariantsAsync(entity.Id, dto.Variants);

            return await GetByIdAsync(entity.Id)
                ?? _mapper.Map<Product, ProductDto>(entity);
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var entity = await _productRepository.GetProductWithDetails(id);
            if (entity == null)
            {
                return null;   // controller maps null → 404 (was throwing → 500)
            }

            var dto = _mapper.Map<Product, ProductDto>(entity);
            dto.CategoryName = entity.Category?.Name;
            dto.SellerName = entity.Seller?.User?.FullName;
            ApplyVariants(dto, entity);
            return dto;
        }

        public async Task<PagedResponse<ProductDto>> GetPagedAsync(
            PagedRequest request,
            int? sellerId = null,
            int? categoryId = null,
            string? search = null)
        {
            var paged = await _productRepository.GetAllPagedProductWithDetails(request, sellerId, categoryId, search);
            var dtoData = paged.Data.Select(entity =>
            {
                var dto = _mapper.Map<Product, ProductDto>(entity);

                dto.CategoryName = entity.Category?.Name;
                dto.SellerName = entity.Seller?.User?.FullName;
                ApplyVariants(dto, entity);

                return dto;
            }).ToList();

            return new PagedResponse<ProductDto>
            {
                PageNumber = paged.PageNumber,
                PageSize = paged.PageSize,
                TotalRecords = paged.TotalRecords,
                Data = dtoData
            };
        }

        public async Task<ProductDto?> UpdateProductAsync(int sellerUserId, int productId, UpdateProductDto dto)
        {
            var seller = await _sellerProfileRepo.FirstOrDefaultAsync(s => s.UserId == sellerUserId && s.IsActive && s.Status == (int)SellerStatus.Approved);
            if (seller == null)
            {
                throw new InvalidOperationException("Seller profile is not approved or does not exist.");
            }

            var entity = await _productRepo.FirstOrDefaultAsync(p => p.Id == productId && p.SellerId == seller.Id);
            if (entity == null)
            {
                return null;
            }

            if (dto.CategoryId.HasValue)
            {
                var exists = await _categoryRepo.AnyAsync(c => c.Id == dto.CategoryId.Value && c.IsActive);
                if (!exists)
                {
                    throw new InvalidOperationException("Category does not exist or is inactive.");
                }
            }

            entity.Name = dto.Name;
            entity.Description = dto.Description;
            entity.Price = dto.Price;
            entity.Stock = dto.Stock;
            entity.Image = dto.Image;
            entity.CategoryId = dto.CategoryId;
            entity.IsActive = dto.IsActive;
            entity.UpdateDate = DateTime.UtcNow;

            _productRepo.Update(entity);
            await _productRepo.SaveChangesAsync();

            await SyncVariantsAsync(entity.Id, dto.Variants);

            return await GetByIdAsync(entity.Id)
                ?? _mapper.Map<Product, ProductDto>(entity);
        }

        public async Task DeleteProductAsync(int sellerUserId, int productId)
        {
            var seller = await _sellerProfileRepo.FirstOrDefaultAsync(s => s.UserId == sellerUserId && s.IsActive && s.Status == (int)SellerStatus.Approved);
            if (seller == null)
            {
                throw new InvalidOperationException("Seller profile is not approved or does not exist.");
            }

            var entity = await _productRepo.FirstOrDefaultAsync(p => p.Id == productId && p.SellerId == seller.Id);
            if (entity == null)
            {
                return;
            }

            _productRepo.Delete(entity);
            await _productRepo.SaveChangesAsync();
        }

        /// <summary>
        /// Brings a product's options in line with what the seller submitted: new ones are added,
        /// existing ones updated in place, and ones the seller dropped are deactivated rather
        /// than deleted — past orders reference them, and a sold-out size that comes back next
        /// season should not lose its sales history.
        /// </summary>
        private async Task SyncVariantsAsync(int productId, List<SaveProductVariantDto> submitted)
        {
            var existing = (await _variantRepo.FindGetAllAsync(v => v.ProductId == productId)).ToList();

            // No variants section sent at all: leave whatever the product already has. Sending an
            // empty list is how a seller says "sell this in a single form" — see below.
            if (submitted == null)
            {
                return;
            }

            var duplicate = submitted
                .GroupBy(v => v.Name.Trim(), StringComparer.OrdinalIgnoreCase)
                .FirstOrDefault(g => g.Count() > 1);
            if (duplicate != null)
            {
                throw new InvalidOperationException($"Duplicate option name '{duplicate.Key}'.");
            }

            var keptIds = new HashSet<int>();

            foreach (var dto in submitted)
            {
                var match = dto.Id > 0 ? existing.FirstOrDefault(v => v.Id == dto.Id) : null;

                if (match == null)
                {
                    await _variantRepo.AddAsync(new ProductVariant
                    {
                        ProductId = productId,
                        Name = dto.Name.Trim(),
                        Sku = string.IsNullOrWhiteSpace(dto.Sku) ? null : dto.Sku.Trim(),
                        Price = dto.Price,
                        Stock = dto.Stock,
                        IsActive = dto.IsActive,
                        SortOrder = dto.SortOrder,
                        CreatedDate = DateTime.UtcNow,
                    });
                    continue;
                }

                keptIds.Add(match.Id);
                match.Name = dto.Name.Trim();
                match.Sku = string.IsNullOrWhiteSpace(dto.Sku) ? null : dto.Sku.Trim();
                match.Price = dto.Price;
                match.Stock = dto.Stock;
                match.IsActive = dto.IsActive;
                match.SortOrder = dto.SortOrder;
                match.UpdateDate = DateTime.UtcNow;
                _variantRepo.Update(match);
            }

            foreach (var dropped in existing.Where(v => v.IsActive && !keptIds.Contains(v.Id)))
            {
                dropped.IsActive = false;
                dropped.UpdateDate = DateTime.UtcNow;
                _variantRepo.Update(dropped);
            }

            await _variantRepo.SaveChangesAsync();
        }

        /// <summary>
        /// Copies a product's live options onto its DTO, and rewrites the headline price and
        /// stock to match them: with options, the price shown is the cheapest one ("from PKR
        /// 1,200") and the stock is the total across them, so a product whose small size sold
        /// out does not read as out of stock.
        /// </summary>
        private static void ApplyVariants(ProductDto dto, Product entity)
        {
            var active = entity.Variants?.Where(v => v.IsActive)
                                         .OrderBy(v => v.SortOrder)
                                         .ThenBy(v => v.Id)
                                         .ToList()
                         ?? new List<ProductVariant>();

            if (active.Count == 0)
            {
                return;
            }

            dto.Variants = active.Select(v => new ProductVariantDto
            {
                Id = v.Id,
                Name = v.Name,
                Sku = v.Sku,
                Price = v.Price,
                Stock = v.Stock,
                IsActive = v.IsActive,
                SortOrder = v.SortOrder,
            }).ToList();

            dto.Price = active.Min(v => v.Price);
            dto.Stock = active.Sum(v => v.Stock);
        }
    }
}

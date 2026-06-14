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
        private readonly IProductRepository _productRepository;
        private readonly IGenericMapper _mapper;

        public ProductService(
            IGenericRepository<Product> productRepo,
            IGenericRepository<SellerProfile> sellerProfileRepo,
            IGenericRepository<Category> categoryRepo,
            IGenericMapper mapper,
            IProductRepository productRepository
            )
        {
            _productRepo = productRepo;
            _sellerProfileRepo = sellerProfileRepo;
            _categoryRepo = categoryRepo;
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

            var created = await _productRepo.GetByIdAsync(entity.Id);
            return _mapper.Map<Product, ProductDto>(created);
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var entity =await _productRepository.GetProductWithDetails(id);
            if (entity == null) throw new InvalidOperationException("Product Not Found");
            
            var dto = _mapper.Map<Product,ProductDto>(entity);
            dto.CategoryName = entity.Category?.Name;
            dto.SellerName = entity.Seller.User.FullName; 
            return dto;
        }

        public async Task<PagedResponse<ProductDto>> GetPagedAsync(PagedRequest request)
        {
            var paged = await _productRepository.GetAllPagedProductWithDetails(request);
            var dtoData = paged.Data.Select(entity =>
            {
                var dto = _mapper.Map<Product, ProductDto>(entity);

                dto.CategoryName = entity.Category?.Name;
                dto.SellerName = entity.Seller?.User?.FullName;

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

            return _mapper.Map<Product, ProductDto>(entity);
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
    }
}

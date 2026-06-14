using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Repository.Common.Dto;
using Repository.Common.Interface;
using Repository.Entities;
using Repository.Implementations;
using Repository.Interfaces;
using Service.Common.Mapper;
using Service.Component;
using Service.DTO;
using Service.Interfaces;

namespace Service.Implementations
{
    public class SellerProfileService : ISellerProfileService
    {
        private readonly IGenericRepository<SellerProfile> _sellerRepo;
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Role> _roleRepo;
        private readonly IGenericMapper _mapper;
        private readonly ISellerRepository _sellerRepository;

        public SellerProfileService(
            IGenericRepository<SellerProfile> sellerRepo,
            IGenericRepository<User> userRepo,
            IGenericMapper mapper,
            IGenericRepository<Role> roleRepo,
            ISellerRepository sellerRepository
            )
        {
            _sellerRepo = sellerRepo;
            _userRepo = userRepo;
            _mapper = mapper;
            _roleRepo = roleRepo;
            _sellerRepository = sellerRepository;
        }

        public async Task<SellerProfileDto> CreateAsync(int userId, CreateSellerProfileDto dto)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            if (await _sellerRepo.AnyAsync(s => s.UserId == userId))
            {
                throw new InvalidOperationException("Seller profile already exists for this user.");
            }

            var entity = _mapper.Map<CreateSellerProfileDto, SellerProfile>(dto);
            entity.UserId = userId;
            entity.IsActive = true;
            entity.Status = Convert.ToInt32(SellerStatus.Pending);
            entity.CreatedBy = userId;
            entity.CreatedDate = DateTime.UtcNow;

            await _sellerRepo.AddAsync(entity);
            await _sellerRepo.SaveChangesAsync();

            return _mapper.Map<SellerProfile, SellerProfileDto>(entity);
        }

        public async Task<PagedResponse<SellerProfileDto>> GetPagedAsync(PagedRequest request)
        {
           
            var paged = await _sellerRepo.GetPagedAsync(request);
            var dtoData = _mapper.MapList<SellerProfile, SellerProfileDto>(paged.Data);
            var users = await _userRepo.GetAllAsync();
            var roles = await _roleRepo.GetAllAsync();

            foreach (var dto in dtoData)
            {
                var user = users.FirstOrDefault(u=>u.Id==dto.UserId);
                if (user !=null) 
                {
                    dto.UserName = user.FullName;
                    var role = roles.FirstOrDefault(r => r.Id == user.RoleId);

                    if (role != null)
                    {
                        dto.RoleName = role.Name;
                    }

                }
            }
            return new PagedResponse<SellerProfileDto>
            {
                PageNumber = paged.PageNumber,
                PageSize = paged.PageSize,
                TotalRecords = paged.TotalRecords,
                Data = dtoData
            };
        }

        public async Task<PagedResponse<SellerProfileDto>> GetAllPendingSeller(PagedRequest request)
        {

            var paged = await _sellerRepo.GetPagedAsync(request,x=>x.Status==(int)SellerStatus.Pending);
            var dtoData = _mapper.MapList<SellerProfile, SellerProfileDto>(paged.Data);
            var users = await _userRepo.GetAllAsync();
            var roles = await _roleRepo.GetAllAsync();
            foreach (var dto in dtoData)
            {
                var user = users.FirstOrDefault(u => u.Id == dto.UserId);
                if (user != null)
                {
                    dto.UserName = user.FullName;
                    var role = roles.FirstOrDefault(r => r.Id == user.RoleId);

                    if (role != null)
                    {
                        dto.RoleName = role.Name;
                    }
                    if (dto.Status == (int)SellerStatus.Pending) 
                    {
                        dto.StatusName = SellerStatus.Pending.ToString();
                    }

                }
            }
            return new PagedResponse<SellerProfileDto>
            {
                PageNumber = paged.PageNumber,
                PageSize = paged.PageSize,
                TotalRecords = paged.TotalRecords,
                Data = dtoData
            };

        }

        public async Task<SellerProfileDto> PendingSellerRequestAccept(int id, int userid)
        {
            var seller = await _sellerRepository.GetSellerWithUser(id);

            try
            {
                if (seller == null)
                { throw new KeyNotFoundException("Seller Not Found"); }
                seller.ApprovedAt = DateTime.Now;
                seller.ApprovedBy = userid;
                seller.UpdateBy = userid;
                seller.UpdateDate = DateTime.Now;
                seller.Status = (int)SellerStatus.Approved;
                seller.User.RoleId = (int)Roles.Seller;
                await _sellerRepo.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                throw new ApplicationException("Failed to approve seller request.", ex); ;
            }
            var role =await _roleRepo.GetByIdAsync(seller.User.RoleId);
           var dto= _mapper.Map<SellerProfile, SellerProfileDto>(seller);
            dto.UserName = seller?.User?.FullName ??"";
            dto.RoleName = role?.Name ??"";
            if (dto.Status == (int)SellerStatus.Approved)
            {
                dto.StatusName = SellerStatus.Approved.ToString();
            }
            return dto;

        }
        public async Task<SellerProfileDto> PendingSellerRequestReject(int id, int userid)
        {
            var seller = await _sellerRepository.GetSellerWithUser(id);

            try
            {
                if (seller == null)
                { throw new KeyNotFoundException("Seller Not Found"); }
                seller.ApprovedAt = DateTime.Now;
                seller.ApprovedBy = userid;
                seller.UpdateBy = userid;
                seller.UpdateDate = DateTime.Now;
                seller.Status = (int)SellerStatus.Rejected;
                seller.User.RoleId = (int)Roles.User;
                await _sellerRepo.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                throw new ApplicationException("Failed to approve seller request.", ex); ;
            }
            var role = await _roleRepo.GetByIdAsync(seller.User.RoleId);
            var dto = _mapper.Map<SellerProfile, SellerProfileDto>(seller);
            dto.UserName = seller?.User?.FullName ??"";
            dto.RoleName = role?.Name ?? "";
            if (dto.Status == (int)SellerStatus.Rejected)
            {
                dto.StatusName = SellerStatus.Rejected.ToString();
            }
            return dto;

        }
        public async Task<SellerProfileDto?> GetByIdAsync(int id, int requestingUserId, string role)
        {
            var entity = await _sellerRepo.GetByIdAsync(id);
            if (entity == null)
            {
                return null;
            }

            var isAdmin = string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase);
            if (!isAdmin && entity.UserId != requestingUserId)
            {
                return null;
            }

            return _mapper.Map<SellerProfile, SellerProfileDto>(entity);
        }

        public async Task<SellerProfileDto?> UpdateAsync(int id, int requestingUserId, string role, UpdateSellerProfileDto dto)
        {
            var entity = await _sellerRepo.GetByIdAsync(id);
            if (entity == null)
            {
                return null;
            }

            var isAdmin = string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase);
            if (!isAdmin && entity.UserId != requestingUserId)
            {
                throw new UnauthorizedAccessException("You cannot update this seller profile.");
            }

            entity.ShopName = dto.StoreName;
            entity.StoreDescription = dto.StoreDescription;
            entity.StoreAddress = dto.StoreAddress;
            entity.PhoneNumber = dto.PhoneNumber;
            entity.UpdateBy = requestingUserId;
            entity.UpdateDate = DateTime.UtcNow;

            _sellerRepo.Update(entity);
            await _sellerRepo.SaveChangesAsync();

            return _mapper.Map<SellerProfile, SellerProfileDto>(entity);

        }

        public async Task DeleteAsync(int id, int adminUserId)
        {
            var entity = await _sellerRepo.GetByIdAsync(id);
            if (entity == null)
            {
                return;
            }

            _sellerRepo.Delete(entity);
            await _sellerRepo.SaveChangesAsync();
        }

       
    }
}


using AutoMapper;
using Repository.Entities;
using Service.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Common.Mapper
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterDto, User>();
            CreateMap<User, RegisterDto>();
            CreateMap<User, UserDto>()
                .ForMember(d => d.RoleId, opt => opt.MapFrom(s => s.RoleId))
                .ForMember(d => d.RoleName, opt => opt.MapFrom(s => s.Role != null ? s.Role.Name : null))
                .ForMember(d => d.Image, opt => opt.MapFrom(s => s.Imgae));
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();
            CreateMap<Category, CategoryDto>();
            CreateMap<Product, CreateProductDto>().ReverseMap();
            CreateMap<Product, ProductDto>();
            CreateMap<Payment, PaymentDto>();
            CreateMap<Role, RoleDto>();
            CreateMap<CreateRoleDto, Role>();
            CreateMap<SellerProfile, SellerProfileDto>().ForMember(d => d.StoreName, opt => opt.MapFrom(s => s.ShopName));
            CreateMap<CreateSellerProfileDto, SellerProfile>().ForMember(d => d.ShopName, opt => opt.MapFrom(s => s.StoreName));
            CreateMap<UpdateSellerProfileDto, SellerProfile>().ForMember(d => d.ShopName, opt => opt.MapFrom(s => s.StoreName));
        }
    }
}

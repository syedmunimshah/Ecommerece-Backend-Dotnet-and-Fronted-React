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
            CreateMap<User, UserDto>();
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();
            CreateMap<Category, CategoryDto>();
            CreateMap<Product, CreateProductDto>().ReverseMap();
            CreateMap<Product, ProductDto>();
            //CreateMap<Cart, CartDto>();
            //CreateMap<CartItem, CartItemDto>();
            //CreateMap<Order, OrderDto>();
            //CreateMap<OrderItem, OrderItemDto>();
            //CreateMap<Payment, PaymentDto>();
            //CreateMap<Review, ReviewDto>();
            //CreateMap<Role, RoleDto>().ReverseMap();
            CreateMap<SellerProfile, SellerProfileDto>().ForMember(d => d.StoreName, opt => opt.MapFrom(s => s.ShopName));
            CreateMap<CreateSellerProfileDto, SellerProfile>().ForMember(d => d.ShopName, opt => opt.MapFrom(s => s.StoreName));
            CreateMap<UpdateSellerProfileDto, SellerProfile>().ForMember(d => d.ShopName, opt => opt.MapFrom(s => s.StoreName));
        }
    }
}

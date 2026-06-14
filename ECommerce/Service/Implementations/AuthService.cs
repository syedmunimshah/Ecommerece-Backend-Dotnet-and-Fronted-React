using Repository.Common.Interface;
using Repository.Entities;
using Service.DTO;
using Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service.Component;
using Service.Common.Mapper;
using BCrypt.Net;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using Repository.Common.Dto;
namespace Service.Implementations

{
    public class AuthService : IAuthService
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Role> _roleRepo;
        private readonly IGenericMapper _mapper;
        private readonly IConfiguration _configuration;

        public AuthService(
            IGenericRepository<User> userRepo,
            IGenericRepository<Role> roleRepo,
            IGenericMapper mapper,
            IConfiguration configuration)
        {
            _userRepo = userRepo;
            _roleRepo = roleRepo;
            _mapper = mapper;
            _configuration = configuration;
        }
        #region Register 
        public async Task<RegisterDto> AddRegister(RegisterDto registerDto)
        {
            try
            {
                var _existUser = await _userRepo.AnyAsync(x => x.Email == registerDto.Email);
                if (_existUser)
                {
                    throw new InvalidOperationException("A user with this email already exists.");
                }
                var _existRole = await _roleRepo.AnyAsync(r => r.Id == Convert.ToInt64(Roles.User) && r.IsActive == true);

                if (!_existRole)
                {
                    throw new InvalidOperationException("Default role 'User' is not configured. Please seed roles.");
                }
                var user = _mapper.Map<RegisterDto, User>(registerDto);

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
                user.RoleId = Convert.ToInt32(Roles.User);
                user.IsActive = true;
                user.CreatedDate = DateTime.UtcNow;

                await _userRepo.AddAsync(user);
                await _userRepo.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw ;
            }
            return registerDto;
        }

        #endregion
        #region Login 
        public async Task<string> Login(LoginDto loginDto)
        {
            var user = await _userRepo.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid email");
            }
            bool passwordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!passwordValid)
            {
                throw new UnauthorizedAccessException("Invalid password");
            }
            var role = await _roleRepo.GetByIdAsync(user.RoleId);
            if (role == null)
            {
                throw new Exception("Role is not configured. Please seed Roles");
            }
            string token = GenerateJwtToken(user, role.Name);

            return token;


        }
        #endregion

        #region Token Generate
        private string GenerateJwtToken(User user, string role)
        {
            var claims = new[] {
                                     new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                                     new Claim(ClaimTypes.Email, user.Email),
                                     new Claim(ClaimTypes.Role, role)
                                };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims, 
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        #endregion
        public async Task<PagedResponse<UserDto>> GetAll(PagedRequest request)
        {
            var result = await _userRepo.GetPagedAsync(request);
            var roles=await _roleRepo.GetAllAsync();
            var dtoData = _mapper.MapList<User,UserDto>(result.Data);

            //foreach (var dto in dtoData)
            //{
            //    var user = result.Data.FirstOrDefault(u => u.Id == dto.Id);

            //    if (user != null)
            //    {
            //        var role = roles.FirstOrDefault(r => r.Id == user.RoleId);
            //        dto.RoleName = role.Name;
            //    }
            //}
            return new PagedResponse<UserDto>
            {
                PageNumber = result.PageNumber,
                PageSize = result.PageSize,
                TotalRecords = result.TotalRecords,
                Data = dtoData
            };
        }

    }
}

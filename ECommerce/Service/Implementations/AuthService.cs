using Repository.Common.Interface;
using Repository.Entities;
using Service.DTO;
using Service.Interfaces;
using Service.Component;
using Service.Common;
using Service.Common.Mapper;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using Repository.Common.Dto;
using System.Security.Cryptography;
using System.Text;
using System.Linq;

namespace Service.Implementations;

public class AuthService : IAuthService
{
    private readonly IGenericRepository<User> _userRepo;
    private readonly IGenericRepository<Role> _roleRepo;
    private readonly IGenericMapper _mapper;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;

    public AuthService(
        IGenericRepository<User> userRepo,
        IGenericRepository<Role> roleRepo,
        IGenericMapper mapper,
        IConfiguration configuration,
        IEmailService emailService)
    {
        _userRepo = userRepo;
        _roleRepo = roleRepo;
        _mapper = mapper;
        _configuration = configuration;
        _emailService = emailService;
    }

    public async Task<UserDto> AddRegister(RegisterDto registerDto)
    {
        var existUser = await _userRepo.AnyAsync(x => x.Email == registerDto.Email);
        if (existUser)
            throw new InvalidOperationException("A user with this email already exists.");

        var existRole = await _roleRepo.AnyAsync(r => r.Id == Convert.ToInt64(Roles.User) && r.IsActive);
        if (!existRole)
            throw new InvalidOperationException("Default role 'User' is not configured. Please seed roles.");

        var user = _mapper.Map<RegisterDto, User>(registerDto);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
        user.RoleId = Convert.ToInt32(Roles.User);
        user.IsActive = true;
        user.CreatedDate = DateTime.UtcNow;

        await _userRepo.AddAsync(user);
        await _userRepo.SaveChangesAsync();
        // Return a safe DTO (never echo the plaintext password back in the response).
        return _mapper.Map<User, UserDto>(user);
    }

    public async Task<TokenResponseDto> LoginAsync(LoginDto loginDto)
    {
        var user = await _userRepo.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
        // Same message for unknown email and wrong password so callers can't enumerate accounts.
        if (user == null)
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Account is deactivated.");

        var role = await _roleRepo.GetByIdAsync(user.RoleId)
            ?? throw new Exception("Role is not configured. Please seed Roles");

        return IssueAccessToken(user, role.Name);
    }

    public async Task ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var user = await _userRepo.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
            return;

        var today = DateTime.UtcNow.Date;
        if (user.OtpDailyRequestDate?.Date != today)
        {
            user.OtpDailyRequestCount = 0;
            user.OtpDailyRequestDate = today;
        }

        var dailyLimit = _configuration.GetValue<int>("Otp:DailyLimit", 5);
        if (user.OtpDailyRequestCount >= dailyLimit)
            return;

        var expiryMinutes = _configuration.GetValue<int>("Otp:ExpiryMinutes", 10);
        var otp = GenerateOtp();

        user.PasswordResetToken = HashOtp(otp);
        user.PasswordResetTokenExpiry = DateTime.UtcNow.AddMinutes(expiryMinutes);
        user.OtpDailyRequestCount++;
        user.OtpDailyRequestDate = today;
        user.UpdateDate = DateTime.UtcNow;
        await _userRepo.SaveChangesAsync();

        await _emailService.SendPasswordResetOtpAsync(user.Email, otp, expiryMinutes);
    }

    public async Task ResetPasswordAsync(ResetPasswordDto dto)
    {
        var user = await _userRepo.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null ||
            user.PasswordResetToken == null ||
            user.PasswordResetTokenExpiry == null ||
            user.PasswordResetTokenExpiry <= DateTime.UtcNow ||
            user.PasswordResetToken != HashOtp(dto.Otp.Trim()))
        {
            throw new InvalidOperationException("Invalid or expired OTP.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiry = null;
        user.UpdateDate = DateTime.UtcNow;
        await _userRepo.SaveChangesAsync();
    }

    public async Task<PagedResponse<UserDto>> GetAll(PagedRequest request)
    {
        var result = await _userRepo.GetPagedAsync(request);
        var users = result.Data.ToList();
        var dtoData = _mapper.MapList<User, UserDto>(users);
        await UserDtoEnricher.ApplyRoleNamesAsync(dtoData, users, _roleRepo);
        return new PagedResponse<UserDto>
        {
            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            TotalRecords = result.TotalRecords,
            Data = dtoData
        };
    }

    private TokenResponseDto IssueAccessToken(User user, string roleName)
    {
        var accessTokenHours = _configuration.GetValue<int>("Jwt:AccessTokenExpiryHours", 2);
        var expiresAt = DateTime.UtcNow.AddHours(accessTokenHours);
        var accessToken = GenerateJwtToken(user, roleName, expiresAt);

        return new TokenResponseDto
        {
            Token = accessToken,
            ExpiresIn = (int)(expiresAt - DateTime.UtcNow).TotalSeconds,
        };
    }

    private string GenerateJwtToken(User user, string role, DateTime expiresAt)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, role),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateOtp()
    {
        return RandomNumberGenerator.GetInt32(1000, 10000).ToString();
    }

    private static string HashOtp(string otp)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(otp));
        return Convert.ToBase64String(bytes);
    }
}

using Repository.Common.Dto;
using Service.DTO;

namespace Service.Interfaces;

public interface IAuthService
{
    Task<UserDto> AddRegister(RegisterDto registerDto);
    Task<TokenResponseDto> LoginAsync(LoginDto loginDto);
    Task ForgotPasswordAsync(ForgotPasswordDto dto);
    Task ResetPasswordAsync(ResetPasswordDto dto);
    Task<PagedResponse<UserDto>> GetAll(PagedRequest request);
}

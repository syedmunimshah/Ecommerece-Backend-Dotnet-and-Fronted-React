using Repository.Common.Dto;
using Repository.Entities;
using Service.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface IAuthService
    {
        Task<RegisterDto> AddRegister(RegisterDto registerDto);
        Task<string> Login(LoginDto loginDto);
        Task<PagedResponse<UserDto>> GetAll(PagedRequest request);

    }
}

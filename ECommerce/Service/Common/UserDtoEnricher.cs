using Repository.Common.Interface;
using Repository.Entities;
using Service.DTO;

namespace Service.Common;

public static class UserDtoEnricher
{
    public static async Task ApplyRoleNamesAsync(
        IReadOnlyList<UserDto> dtos,
        IReadOnlyList<User> users,
        IGenericRepository<Role> roleRepo)
    {
        if (dtos.Count == 0)
        {
            return;
        }

        var roles = await roleRepo.GetAllAsync();
        var roleById = roles.ToDictionary(r => r.Id);
        var userById = users.ToDictionary(u => u.Id);

        foreach (var dto in dtos)
        {
            if (!userById.TryGetValue(dto.Id, out var user))
            {
                continue;
            }

            dto.RoleId = user.RoleId;
            if (roleById.TryGetValue(user.RoleId, out var role))
            {
                dto.RoleName = role.Name;
            }
        }
    }

    public static async Task ApplyRoleNameAsync(UserDto dto, User user, IGenericRepository<Role> roleRepo)
    {
        dto.RoleId = user.RoleId;
        var role = await roleRepo.GetByIdAsync(user.RoleId);
        if (role != null)
        {
            dto.RoleName = role.Name;
        }
    }
}

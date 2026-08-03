using Microsoft.EntityFrameworkCore;
using Repository.Entities;

namespace ECommerce.Seed;

/// <summary>
/// Inserts missing default roles only — never updates or deletes existing rows.
/// </summary>
public static class RoleEnsurer
{
    public static async Task EnsureAsync(AppDbContext context)
    {
        var defaults = new[] { "Admin", "User", "Seller" };
        var existing = await context.Roles.Select(r => r.Name).ToListAsync();
        var now = DateTime.UtcNow;

        foreach (var name in defaults)
        {
            if (existing.Contains(name)) continue;
            context.Roles.Add(new Role
            {
                Name = name,
                IsActive = true,
                CreatedDate = now,
            });
            Console.WriteLine($"[Seed] Added missing role: {name}");
        }

        if (context.ChangeTracker.HasChanges())
            await context.SaveChangesAsync();
    }
}

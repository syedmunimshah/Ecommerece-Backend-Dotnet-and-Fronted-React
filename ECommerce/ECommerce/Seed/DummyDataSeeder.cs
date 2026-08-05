using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Repository.Entities;
using Service.Component;

namespace ECommerce.Seed;

public static class DummyDataSeeder
{
    private const string DefaultPassword = "Password123";
    private const string SeedMarkerEmail = "admin@edgecart.pk";

    public static async Task SeedAsync(AppDbContext context)
    {
        // Idempotent: seed only once, keyed on the dummy admin account. This runs even
        // if other (e.g. manually-created) users already exist, so the demo data still
        // loads, and it won't duplicate on subsequent startups.
        if (await context.Users.AnyAsync(u => u.Email == SeedMarkerEmail))
        {
            Console.WriteLine("[Seed] Dummy data already present — skipping seed.");
            return;
        }

        var adminRole = await context.Roles.FirstAsync(r => r.Name == "Admin");
        var userRole = await context.Roles.FirstAsync(r => r.Name == "User");
        var sellerRole = await context.Roles.FirstAsync(r => r.Name == "Seller");

        var now = DateTime.UtcNow;

        var admin = new User
        {
            FullName = "EdgeCart Admin",
            Email = "admin@edgecart.pk",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(DefaultPassword),
            RoleId = adminRole.Id,
            IsActive = true,
            CreatedDate = now,
        };

        var customer = new User
        {
            FullName = "Ali Khan",
            Email = "customer@edgecart.pk",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(DefaultPassword),
            RoleId = userRole.Id,
            IsActive = true,
            CreatedDate = now,
        };

        var sellerUser = new User
        {
            FullName = "Tech Store Owner",
            Email = "seller@edgecart.pk",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(DefaultPassword),
            RoleId = sellerRole.Id,
            IsActive = true,
            CreatedDate = now,
        };

        context.Users.AddRange(admin, customer, sellerUser);
        await context.SaveChangesAsync();

        var categories = new[]
        {
            new Category { Name = "Electronics", IsActive = true, CreatedDate = now, CreatedBy = admin.Id },
            new Category { Name = "Fashion", IsActive = true, CreatedDate = now, CreatedBy = admin.Id },
            new Category { Name = "Gaming", IsActive = true, CreatedDate = now, CreatedBy = admin.Id },
            new Category { Name = "Mobile", IsActive = true, CreatedDate = now, CreatedBy = admin.Id },
            new Category { Name = "Audio", IsActive = true, CreatedDate = now, CreatedBy = admin.Id },
        };
        context.Categories.AddRange(categories);
        await context.SaveChangesAsync();

        var sellerProfile = new SellerProfile
        {
            UserId = sellerUser.Id,
            ShopName = "Tech Zone PK",
            StoreDescription = "Electronics, mobile & gaming gear.",
            StoreAddress = "Saddar, Karachi",
            PhoneNumber = "03001234567",
            Status = (int)SellerStatus.Approved,
            IsActive = true,
            ApprovedBy = admin.Id,
            ApprovedAt = now.AddDays(-10),
            CreatedDate = now.AddDays(-10),
            CreatedBy = sellerUser.Id,
        };
        context.SellerProfiles.Add(sellerProfile);
        await context.SaveChangesAsync();

        var cat = categories.ToDictionary(c => c.Name, c => c.Id);

        var products = new List<Product>
        {
            new() { SellerId = sellerProfile.Id, CategoryId = cat["Mobile"], Name = "iPhone 15 Pro", Description = "A17 Pro, 48MP camera, titanium.", Price = 349999, Stock = 25, IsActive = true, Image = "https://iphone.biz.pk/wp-content/uploads/2024/06/iPhone-15-pro.png", CreatedDate = now, CreatedBy = sellerUser.Id },
            new() { SellerId = sellerProfile.Id, CategoryId = cat["Mobile"], Name = "Samsung Galaxy S24 Ultra", Description = "200MP camera, S Pen included.", Price = 289999, Stock = 30, IsActive = true, Image = "https://bsimg.nl/images/samsung-galaxy-s24-ultra-256gb-s928-zwart-eu_1.png/DeDGCO1haQCWTq_Xo7ce6zGjlts%3D/fit-in/0x0/filters%3Aupscale%28%29", CreatedDate = now, CreatedBy = sellerUser.Id },
            new() { SellerId = sellerProfile.Id, CategoryId = cat["Electronics"], Name = "MacBook Air M3", Description = "13-inch, 8GB RAM, 256GB SSD.", Price = 429999, Stock = 15, IsActive = true, Image = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600", CreatedDate = now, CreatedBy = sellerUser.Id },
            new() { SellerId = sellerProfile.Id, CategoryId = cat["Audio"], Name = "Sony WH-1000XM5", Description = "Industry-leading noise cancelling.", Price = 89999, Stock = 40, IsActive = true, Image = "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600", CreatedDate = now, CreatedBy = sellerUser.Id },
            new() { SellerId = sellerProfile.Id, CategoryId = cat["Audio"], Name = "AirPods Pro 2", Description = "Active noise cancellation, spatial audio.", Price = 64999, Stock = 50, IsActive = true, Image = "https://pakistanstore.pk/wp-content/uploads/2022/12/Apple-AirPods-Pro-2-ANC-Copy.jpg", CreatedDate = now, CreatedBy = sellerUser.Id },
            new() { SellerId = sellerProfile.Id, CategoryId = cat["Gaming"], Name = "Gaming Console Z", Description = "4K 120fps, ray tracing.", Price = 85000, Stock = 12, IsActive = true, Image = "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/d2234360-f40f-4139-b136-061576ced5da.jpg;maxHeight=1920;maxWidth=900?format=webp", CreatedDate = now, CreatedBy = sellerUser.Id },
            new() { SellerId = sellerProfile.Id, CategoryId = cat["Gaming"], Name = "Pro Gaming Headset", Description = "7.1 surround, RGB lighting.", Price = 12500, Stock = 35, IsActive = true, Image = "https://pakistanstore.pk/wp-content/uploads/2024/12/Onikuma-X25-Pro-Gaming-Headset.jpg", CreatedDate = now, CreatedBy = sellerUser.Id },
            new() { SellerId = sellerProfile.Id, CategoryId = cat["Fashion"], Name = "Premium Leather Jacket", Description = "Genuine leather, slim fit.", Price = 12500, Stock = 20, IsActive = true, Image = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600", CreatedDate = now, CreatedBy = sellerUser.Id },
            new() { SellerId = sellerProfile.Id, CategoryId = cat["Fashion"], Name = "Running Sneakers", Description = "Lightweight cushioned sole.", Price = 7500, Stock = 45, IsActive = true, Image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", CreatedDate = now, CreatedBy = sellerUser.Id },
            new() { SellerId = sellerProfile.Id, CategoryId = cat["Electronics"], Name = "Smart Watch Pro", Description = "Health tracking, GPS, 7-day battery.", Price = 45000, Stock = 28, IsActive = true, Image = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", CreatedDate = now, CreatedBy = sellerUser.Id },
            new() { SellerId = sellerProfile.Id, CategoryId = cat["Mobile"], Name = "Wireless Power Bank 20K", Description = "Fast charge, dual USB-C.", Price = 4500, Stock = 80, IsActive = true, Image = "https://powerhouseexpress.com.pk/cdn/shop/files/space-core-external-power-bank3.webp?v=1744563482&width=1200", CreatedDate = now, CreatedBy = sellerUser.Id },
            new() { SellerId = sellerProfile.Id, CategoryId = cat["Gaming"], Name = "Mechanical Keyboard RGB", Description = "Hot-swappable switches.", Price = 8900, Stock = 22, IsActive = true, Image = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600", CreatedDate = now, CreatedBy = sellerUser.Id },
        };
        context.Products.AddRange(products);
        await context.SaveChangesAsync();

        var cart = new Cart { UserId = customer.Id, CreatedDate = now };
        context.Carts.Add(cart);
        await context.SaveChangesAsync();

        context.CartItems.Add(new CartItem
        {
            CartId = cart.Id,
            ProductId = products[0].Id,
            Quantity = 1,
            CreatedDate = now,
        });
        await context.SaveChangesAsync();

        var order = new Order
        {
            UserId = customer.Id,
            TotalAmount = products[4].Price,
            Status = "Delivered",
            CreatedDate = now.AddDays(-5),
            CreatedBy = customer.Id,
        };
        context.Orders.Add(order);
        await context.SaveChangesAsync();

        context.OrderItems.Add(new OrderItem
        {
            OrderId = order.Id,
            ProductId = products[4].Id,
            Quantity = 1,
            Price = products[4].Price,
            CreatedDate = now.AddDays(-5),
        });

        context.Payments.Add(new Payment
        {
            OrderId = order.Id,
            PaymentMethod = "Card",
            TransactionId = "TXN-EC-10001",
            Amount = products[4].Price,
            Status = "Completed",
            PaidAt = now.AddDays(-5),
            CreatedDate = now.AddDays(-5),
        });

        context.OrderTrackings.AddRange(
            new OrderTracking { OrderId = order.Id, Status = "Order Placed", CreatedDate = now.AddDays(-5) },
            new OrderTracking { OrderId = order.Id, Status = "Processing", CreatedDate = now.AddDays(-4) },
            new OrderTracking { OrderId = order.Id, Status = "Shipped", CreatedDate = now.AddDays(-3) },
            new OrderTracking { OrderId = order.Id, Status = "Delivered", CreatedDate = now.AddDays(-2) }
        );

        context.Reviews.AddRange(
            new Review
            {
                ProductId = products[0].Id,
                UserId = customer.Id,
                Rating = 5,
                Comment = "Excellent phone! Fast delivery.",
                CreatedDate = now.AddDays(-3),
            },
            new Review
            {
                ProductId = products[0].Id,
                UserId = customer.Id,
                Rating = 4,
                Comment = "Great camera quality. Battery could be better.",
                CreatedDate = now.AddDays(-2),
            },
            new Review
            {
                ProductId = products[0].Id,
                UserId = admin.Id,
                Rating = 5,
                Comment = "Premium build — recommended for Mobile category.",
                CreatedDate = now.AddDays(-1),
            }
        );

        await context.SaveChangesAsync();

        Console.WriteLine("[Seed] Dummy data inserted successfully.");
        Console.WriteLine("[Seed] ── Test accounts (Swagger / Frontend) ──");
        Console.WriteLine("[Seed] Admin:    admin@edgecart.pk    / Password123");
        Console.WriteLine("[Seed] Customer: customer@edgecart.pk / Password123");
        Console.WriteLine("[Seed] Seller:   seller@edgecart.pk   / Password123");
        Console.WriteLine($"[Seed] SellerProfile Id (for ?sellerId=): {sellerProfile.Id}");
        Console.WriteLine($"[Seed] Test order Id (tracking): {order.Id}");
        Console.WriteLine($"[Seed] iPhone product Id (reviews): {products[0].Id}");
        Console.WriteLine("[Seed] Search test: GET /api/product/getall?search=iphone");
    }
}

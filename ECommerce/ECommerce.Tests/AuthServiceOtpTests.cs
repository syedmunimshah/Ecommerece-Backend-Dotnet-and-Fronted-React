using System.Linq.Expressions;
using Microsoft.Extensions.Configuration;
using Moq;
using Repository.Common.Interface;
using Repository.Entities;
using Service.Common.Mapper;
using Service.DTO;
using Service.Implementations;
using Service.Interfaces;

namespace ECommerce.Tests;

/// <summary>
/// Password reset is the one anonymous endpoint that sends mail and grants account
/// access, so these cover what stops it being abused: the per-day cap, expiry, and
/// not revealing whether an address is registered.
/// </summary>
public class AuthServiceOtpTests
{
    private readonly Mock<IGenericRepository<User>> _users = new();
    private readonly Mock<IGenericRepository<Role>> _roles = new();
    private readonly Mock<IGenericMapper> _mapper = new();
    private readonly Mock<IEmailService> _email = new();

    private static IConfiguration Config(int dailyLimit = 5, int expiryMinutes = 10) =>
        new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Otp:DailyLimit"] = dailyLimit.ToString(),
            ["Otp:ExpiryMinutes"] = expiryMinutes.ToString(),
        }).Build();

    private AuthService CreateService(IConfiguration? config = null) =>
        new(_users.Object, _roles.Object, _mapper.Object, config ?? Config(), _email.Object);

    private void StubUser(User? user) =>
        _users.Setup(r => r.FirstOrDefaultAsync(It.IsAny<Expression<Func<User, bool>>>()))
              .ReturnsAsync(user);

    [Fact]
    public async Task ForgotPassword_ForUnknownEmail_SendsNothingAndDoesNotThrow()
    {
        StubUser(null);

        // Succeeding silently is deliberate: a different response for unknown addresses
        // would turn this endpoint into a way to discover who has an account.
        await CreateService().ForgotPasswordAsync(new ForgotPasswordDto { Email = "nobody@example.com" });

        _email.Verify(e => e.SendPasswordResetOtpAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>()), Times.Never);
    }

    [Fact]
    public async Task ForgotPassword_ForKnownEmail_SendsOtpAndStoresHashNotThePlainCode()
    {
        var user = new User { Id = 1, Email = "ali@example.com", FullName = "Ali" };
        StubUser(user);
        string? sentOtp = null;
        _email.Setup(e => e.SendPasswordResetOtpAsync(user.Email, It.IsAny<string>(), It.IsAny<int>()))
              .Callback<string, string, int>((_, otp, _) => sentOtp = otp)
              .Returns(Task.CompletedTask);

        await CreateService().ForgotPasswordAsync(new ForgotPasswordDto { Email = user.Email });

        Assert.NotNull(sentOtp);
        Assert.Equal(4, sentOtp!.Length);
        Assert.NotNull(user.PasswordResetToken);
        Assert.NotEqual(sentOtp, user.PasswordResetToken); // stored hashed, never in the clear
        Assert.True(user.PasswordResetTokenExpiry > DateTime.UtcNow);
    }

    [Fact]
    public async Task ForgotPassword_OnceTheDailyLimitIsReached_StopsSending()
    {
        var user = new User
        {
            Id = 1,
            Email = "ali@example.com",
            OtpDailyRequestCount = 5,
            OtpDailyRequestDate = DateTime.UtcNow.Date,
        };
        StubUser(user);

        await CreateService(Config(dailyLimit: 5)).ForgotPasswordAsync(new ForgotPasswordDto { Email = user.Email });

        _email.Verify(e => e.SendPasswordResetOtpAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>()), Times.Never);
    }

    [Fact]
    public async Task ForgotPassword_WhenYesterdaysCountIsStale_ResetsAndSendsAgain()
    {
        var user = new User
        {
            Id = 1,
            Email = "ali@example.com",
            OtpDailyRequestCount = 5,
            OtpDailyRequestDate = DateTime.UtcNow.Date.AddDays(-1),
        };
        StubUser(user);

        await CreateService(Config(dailyLimit: 5)).ForgotPasswordAsync(new ForgotPasswordDto { Email = user.Email });

        _email.Verify(e => e.SendPasswordResetOtpAsync(user.Email, It.IsAny<string>(), It.IsAny<int>()), Times.Once);
        Assert.Equal(1, user.OtpDailyRequestCount);
    }

    [Fact]
    public async Task ResetPassword_WithTheWrongOtp_ThrowsAndLeavesThePasswordAlone()
    {
        var user = new User { Id = 1, Email = "ali@example.com", PasswordHash = "original" };
        StubUser(user);
        _email.Setup(e => e.SendPasswordResetOtpAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>()))
              .Returns(Task.CompletedTask);
        var service = CreateService();
        await service.ForgotPasswordAsync(new ForgotPasswordDto { Email = user.Email });

        var act = () => service.ResetPasswordAsync(new ResetPasswordDto
        {
            Email = user.Email,
            Otp = "0000",
            NewPassword = "BrandNewPass1",
        });

        await Assert.ThrowsAsync<InvalidOperationException>(act);
        Assert.Equal("original", user.PasswordHash);
    }

    [Fact]
    public async Task ResetPassword_WithAnExpiredOtp_Throws()
    {
        var user = new User
        {
            Id = 1,
            Email = "ali@example.com",
            PasswordHash = "original",
            PasswordResetToken = "whatever-hash",
            PasswordResetTokenExpiry = DateTime.UtcNow.AddMinutes(-1),
        };
        StubUser(user);

        var act = () => CreateService().ResetPasswordAsync(new ResetPasswordDto
        {
            Email = user.Email,
            Otp = "1234",
            NewPassword = "BrandNewPass1",
        });

        await Assert.ThrowsAsync<InvalidOperationException>(act);
        Assert.Equal("original", user.PasswordHash);
    }
}

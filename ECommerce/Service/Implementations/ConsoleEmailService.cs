using Microsoft.Extensions.Logging;
using Service.Interfaces;

namespace Service.Implementations;

public class ConsoleEmailService : IEmailService
{
    private readonly ILogger<ConsoleEmailService> _logger;

    public ConsoleEmailService(ILogger<ConsoleEmailService> logger)
    {
        _logger = logger;
    }

    public Task SendPasswordResetOtpAsync(string toEmail, string otp, int expiryMinutes)
    {
        _logger.LogInformation("[Email] Password reset OTP for {Email}: {Otp} (expires in {Minutes} min)", toEmail, otp, expiryMinutes);
        Console.WriteLine($"[Email] Password reset OTP for {toEmail}: {otp} (valid {expiryMinutes} minutes)");
        return Task.CompletedTask;
    }
}

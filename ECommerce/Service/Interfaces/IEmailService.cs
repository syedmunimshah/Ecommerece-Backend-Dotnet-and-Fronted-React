namespace Service.Interfaces;

public interface IEmailService
{
    Task SendPasswordResetOtpAsync(string toEmail, string otp, int expiryMinutes);
}

using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using Service.Interfaces;

namespace Service.Implementations;

public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendPasswordResetOtpAsync(string toEmail, string otp, int expiryMinutes)
    {
        var host = _configuration["Smtp:Host"] ?? "smtp.gmail.com";
        var port = _configuration.GetValue<int>("Smtp:Port", 587);
        var username = _configuration["Smtp:Username"] ?? throw new InvalidOperationException("Smtp:Username is not configured.");
        var password = _configuration["Smtp:Password"];
        if (string.IsNullOrWhiteSpace(password))
            throw new InvalidOperationException("Smtp:Password is not configured. Use Gmail App Password.");

        var fromAddress = _configuration["Smtp:FromAddress"] ?? username;
        var fromName = _configuration["Smtp:FromName"] ?? "EdgeCart";

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(fromName, fromAddress));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = "EdgeCart — Password Reset OTP";
        message.Body = new TextPart("html")
        {
            Text = $"""
                <p>Hello,</p>
                <p>Your EdgeCart password reset code is:</p>
                <p style="font-size:28px;font-weight:bold;letter-spacing:4px;">{otp}</p>
                <p>This 4-digit code expires in <strong>{expiryMinutes} minutes</strong>.</p>
                <p>Maximum <strong>5 OTP requests per day</strong> per account.</p>
                <p>If you did not request this, ignore this email.</p>
                """
        };

        using var client = new SmtpClient();
        await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(username, password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);

        _logger.LogInformation("[Email] Password reset OTP sent to {Email}", toEmail);
    }
}

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
        message.Body = new BodyBuilder
        {
            HtmlBody = BuildOtpHtml(otp, expiryMinutes),
            // Plain-text alternative: text-only clients and spam filters both expect one.
            TextBody = $"""
                EdgeCart — Password reset

                Your password reset code is: {otp}

                This code expires in {expiryMinutes} minutes.
                Up to 5 reset requests are allowed per day, per account.

                Didn't request this? You can safely ignore this email — your
                password stays unchanged until the code above is used.
                """
        }.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(username, password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);

        _logger.LogInformation("[Email] Password reset OTP sent to {Email}", toEmail);
    }

    /// <summary>
    /// Branded OTP email. Built with tables and inline styles on purpose: mail clients
    /// (Outlook especially) ignore flexbox/grid and routinely strip &lt;style&gt; blocks,
    /// so anything not inlined here would be dropped. Colours mirror the site's light
    /// theme, and every background is stated explicitly so dark-mode clients that
    /// auto-invert still leave readable text.
    /// </summary>
    private static string BuildOtpHtml(string otp, int expiryMinutes) => $"""
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EdgeCart password reset</title></head>
        <body style="margin:0;padding:0;background-color:#f3f4f6;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6;padding:32px 12px;">
            <tr><td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

                <tr><td style="background-color:#2563eb;background-image:linear-gradient(135deg,#2563eb 0%,#7c3aed 100%);padding:26px 32px;">
                  <span style="color:#ffffff;font-size:21px;font-weight:700;letter-spacing:-0.4px;">&#9670;&nbsp; EdgeCart</span>
                </td></tr>

                <tr><td style="padding:36px 32px 20px;">
                  <h1 style="margin:0 0 10px;font-size:20px;font-weight:700;color:#0a0a0a;">Reset your password</h1>
                  <p style="margin:0;font-size:14px;line-height:22px;color:#6b7280;">Enter this code on the password reset page to choose a new password.</p>
                </td></tr>

                <tr><td style="padding:0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><td align="center" style="background-color:#f8f9fb;border:1px solid #e5e7eb;border-radius:12px;padding:26px 16px;">
                      <div style="font-size:38px;font-weight:700;letter-spacing:10px;text-indent:10px;color:#0a0a0a;">{otp}</div>
                      <div style="margin-top:10px;font-size:12px;color:#6b7280;">Expires in {expiryMinutes} minutes</div>
                    </td></tr>
                  </table>
                </td></tr>

                <tr><td style="padding:24px 32px 0;">
                  <p style="margin:0;font-size:13px;line-height:21px;color:#6b7280;">Up to <strong style="color:#0a0a0a;">5 reset requests</strong> are allowed per day, per account.</p>
                </td></tr>

                <tr><td style="padding:20px 32px 32px;">
                  <div style="border-top:1px solid #e5e7eb;padding-top:18px;">
                    <p style="margin:0;font-size:13px;line-height:21px;color:#6b7280;">Didn't request this? You can safely ignore this email — your password stays unchanged until the code above is used.</p>
                  </div>
                </td></tr>

                <tr><td style="background-color:#f8f9fb;border-top:1px solid #e5e7eb;padding:18px 32px;">
                  <p style="margin:0;font-size:12px;color:#9ca3af;">EdgeCart &middot; This is an automated message, please don't reply.</p>
                </td></tr>

              </table>
            </td></tr>
          </table>
        </body>
        </html>
        """;
}

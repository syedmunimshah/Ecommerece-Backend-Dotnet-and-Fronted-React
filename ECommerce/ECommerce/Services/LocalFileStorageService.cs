using Microsoft.Extensions.Configuration;
using Service.Interfaces;

namespace ECommerce.Services;

public class LocalFileStorageService : IFileStorageService
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".gif"
    };

    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
    };

    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _configuration;

    public LocalFileStorageService(IWebHostEnvironment env, IConfiguration configuration)
    {
        _env = env;
        _configuration = configuration;
    }

    public async Task<(string Url, string FileName)> SaveProductImageAsync(
        Stream content,
        string originalFileName,
        string contentType,
        long length)
    {
        var maxSize = _configuration.GetValue<long>("FileUpload:MaxSizeBytes", 5 * 1024 * 1024);
        if (length <= 0 || length > maxSize)
            throw new InvalidOperationException($"File size must be between 1 byte and {maxSize} bytes.");

        var extension = Path.GetExtension(originalFileName);
        if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
            throw new InvalidOperationException("Allowed formats: JPG, JPEG, PNG, WEBP, GIF.");

        if (!IsAllowedContentType(contentType, extension))
            throw new InvalidOperationException("Invalid image content type.");

        var uploadsDir = Path.Combine(_env.WebRootPath, "uploads", "products");
        Directory.CreateDirectory(uploadsDir);

        var publicBaseUrl = _configuration["App:PublicBaseUrl"]?.TrimEnd('/') ?? "http://localhost:5241";
        return await SaveToUploadsAsync(content, extension, uploadsDir, "products", publicBaseUrl);
    }

    public async Task<(string Url, string FileName)> SaveProfileImageAsync(
        Stream content,
        string originalFileName,
        string contentType,
        long length)
    {
        var maxSize = _configuration.GetValue<long>("FileUpload:MaxSizeBytes", 5 * 1024 * 1024);
        if (length <= 0 || length > maxSize)
            throw new InvalidOperationException($"File size must be between 1 byte and {maxSize} bytes.");

        var extension = Path.GetExtension(originalFileName);
        if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
            throw new InvalidOperationException("Allowed formats: JPG, JPEG, PNG, WEBP, GIF.");

        if (!IsAllowedContentType(contentType, extension))
            throw new InvalidOperationException("Invalid image content type.");

        var uploadsDir = Path.Combine(_env.WebRootPath, "uploads", "profiles");
        Directory.CreateDirectory(uploadsDir);

        var publicBaseUrl = _configuration["App:PublicBaseUrl"]?.TrimEnd('/') ?? "http://localhost:5241";
        return await SaveToUploadsAsync(content, extension, uploadsDir, "profiles", publicBaseUrl);
    }

    private static bool IsAllowedContentType(string contentType, string extension)
    {
        if (!string.IsNullOrWhiteSpace(contentType) && AllowedContentTypes.Contains(contentType))
            return true;

        var ext = extension.ToLowerInvariant();
        return ext is ".jpg" or ".jpeg" or ".png" or ".webp" or ".gif";
    }

    private static async Task<(string Url, string FileName)> SaveToUploadsAsync(
        Stream content,
        string extension,
        string uploadsDir,
        string folder,
        string publicBaseUrl)
    {
        var fileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var filePath = Path.Combine(uploadsDir, fileName);

        await using var fileStream = new FileStream(filePath, FileMode.CreateNew);
        await content.CopyToAsync(fileStream);

        var url = $"{publicBaseUrl}/uploads/{folder}/{fileName}";
        return (url, fileName);
    }
}

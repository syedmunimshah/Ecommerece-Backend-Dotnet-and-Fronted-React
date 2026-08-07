using Service.Interfaces;

namespace ECommerce.Services;

/// <summary>
/// Stores uploads on the web server's own disk. Used for local development, and as the
/// fallback when no blob connection string is configured.
/// </summary>
public class LocalFileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _configuration;

    public LocalFileStorageService(IWebHostEnvironment env, IConfiguration configuration)
    {
        _env = env;
        _configuration = configuration;
    }

    /// <summary>
    /// Where uploaded files are written. Defaults to wwwroot/uploads for local dev, but
    /// on App Service this must point outside the deployment folder (e.g. /home/data/uploads)
    /// — publishing replaces wwwroot wholesale, taking every uploaded file with it.
    /// Program.cs serves whatever this resolves to at /uploads.
    /// </summary>
    private string UploadsRoot =>
        _configuration["FileUpload:RootPath"] is { Length: > 0 } configured
            ? configured
            : Path.Combine(_env.WebRootPath, "uploads");

    public Task<(string Url, string FileName)> SaveProductImageAsync(
        Stream content, string originalFileName, string contentType, long length) =>
        SaveAsync(content, originalFileName, contentType, length, "products");

    public Task<(string Url, string FileName)> SaveProfileImageAsync(
        Stream content, string originalFileName, string contentType, long length) =>
        SaveAsync(content, originalFileName, contentType, length, "profiles");

    private async Task<(string Url, string FileName)> SaveAsync(
        Stream content, string originalFileName, string contentType, long length, string folder)
    {
        var maxSize = _configuration.GetValue<long>("FileUpload:MaxSizeBytes", 5 * 1024 * 1024);
        var extension = UploadValidation.Validate(originalFileName, contentType, length, maxSize);

        var uploadsDir = Path.Combine(UploadsRoot, folder);
        Directory.CreateDirectory(uploadsDir);

        var fileName = UploadValidation.NewFileName(extension);
        await using var fileStream = new FileStream(Path.Combine(uploadsDir, fileName), FileMode.CreateNew);
        await content.CopyToAsync(fileStream);

        var publicBaseUrl = _configuration["App:PublicBaseUrl"]?.TrimEnd('/') ?? "http://localhost:5241";
        return ($"{publicBaseUrl}/uploads/{folder}/{fileName}", fileName);
    }
}

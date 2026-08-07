using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Service.Interfaces;

namespace ECommerce.Services;

/// <summary>
/// Stores uploads in Azure Blob Storage instead of on the web server's disk. Files then
/// outlive the app entirely — a redeploy, a restart, or moving to a different App Service
/// leaves them untouched — and every instance sees the same files when scaled out.
/// Selected in Program.cs whenever Storage:ConnectionString is configured.
/// </summary>
public class BlobFileStorageService : IFileStorageService
{
    private readonly BlobContainerClient _container;
    private readonly IConfiguration _configuration;

    public BlobFileStorageService(BlobContainerClient container, IConfiguration configuration)
    {
        _container = container;
        _configuration = configuration;
    }

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
        var fileName = UploadValidation.NewFileName(extension);

        var blob = _container.GetBlobClient($"{folder}/{fileName}");

        // Content type has to be set explicitly, otherwise blobs are served as
        // application/octet-stream and browsers download them instead of rendering.
        await blob.UploadAsync(content, new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders { ContentType = ResolveContentType(contentType, extension) }
        });

        return (blob.Uri.ToString(), fileName);
    }

    private static string ResolveContentType(string contentType, string extension) =>
        !string.IsNullOrWhiteSpace(contentType) && contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase)
            ? contentType
            : extension switch
            {
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                _ => "image/jpeg",
            };
}

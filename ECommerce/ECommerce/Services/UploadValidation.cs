namespace ECommerce.Services;

/// <summary>
/// Upload rules shared by every <see cref="Service.Interfaces.IFileStorageService"/>
/// implementation, so swapping disk for blob storage cannot quietly change what the
/// API accepts.
/// </summary>
internal static class UploadValidation
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".gif"
    };

    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
    };

    /// <summary>
    /// Throws if the upload is rejected; otherwise returns the lower-cased extension.
    /// </summary>
    public static string Validate(string originalFileName, string contentType, long length, long maxSize)
    {
        if (length <= 0 || length > maxSize)
            throw new InvalidOperationException($"File size must be between 1 byte and {maxSize} bytes.");

        var extension = Path.GetExtension(originalFileName);
        if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
            throw new InvalidOperationException("Allowed formats: JPG, JPEG, PNG, WEBP, GIF.");

        if (!IsAllowedContentType(contentType, extension))
            throw new InvalidOperationException("Invalid image content type.");

        return extension.ToLowerInvariant();
    }

    /// <summary>Random name: two users uploading "photo.jpg" must not collide.</summary>
    public static string NewFileName(string extension) => $"{Guid.NewGuid():N}{extension}";

    private static bool IsAllowedContentType(string contentType, string extension)
    {
        if (!string.IsNullOrWhiteSpace(contentType) && AllowedContentTypes.Contains(contentType))
            return true;

        var ext = extension.ToLowerInvariant();
        return ext is ".jpg" or ".jpeg" or ".png" or ".webp" or ".gif";
    }
}

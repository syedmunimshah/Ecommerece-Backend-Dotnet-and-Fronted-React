namespace Service.Interfaces;

public interface IFileStorageService
{
    Task<(string Url, string FileName)> SaveProductImageAsync(Stream content, string originalFileName, string contentType, long length);
    Task<(string Url, string FileName)> SaveProfileImageAsync(Stream content, string originalFileName, string contentType, long length);
}

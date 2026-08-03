using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Middleware
{
    /// <summary>
    /// Turns unhandled exceptions into consistent RFC-7807 ProblemDetails responses.
    /// Business-rule violations (InvalidOperationException) become 400s with their
    /// message; unexpected errors become a generic 500 (no internal detail leaked)
    /// and are logged in full.
    /// </summary>
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            var (status, title) = exception switch
            {
                InvalidOperationException => (StatusCodes.Status400BadRequest, exception.Message),
                ArgumentException => (StatusCodes.Status400BadRequest, exception.Message),
                KeyNotFoundException => (StatusCodes.Status404NotFound, exception.Message),
                UnauthorizedAccessException => (StatusCodes.Status403Forbidden, exception.Message),
                _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
            };

            if (status == StatusCodes.Status500InternalServerError)
            {
                _logger.LogError(exception, "Unhandled exception on {Method} {Path}",
                    httpContext.Request.Method, httpContext.Request.Path);
            }
            else
            {
                _logger.LogWarning("Request failed ({Status}) on {Method} {Path}: {Message}",
                    status, httpContext.Request.Method, httpContext.Request.Path, exception.Message);
            }

            var problem = new ProblemDetails
            {
                Status = status,
                Title = title,
                Type = $"https://httpstatuses.io/{status}"
            };

            httpContext.Response.StatusCode = status;
            await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken);
            return true;
        }
    }
}

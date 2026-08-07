using Service.DTO;
using Service.Interfaces;
using System;
using System.Threading.Tasks;

namespace Service.Implementations
{
    /// <summary>
    /// Stands in for <see cref="ChatService"/> when no Claude API key is configured, so the app
    /// still boots and every other feature keeps working — the same fallback shape the email
    /// services use. The controller turns this into a 503.
    /// </summary>
    public class UnavailableChatService : IChatService
    {
        public Task<ChatResponseDto> SendAsync(int userId, string role, ChatRequestDto dto) =>
            throw new InvalidOperationException("The AI assistant is not configured on this server.");
    }
}

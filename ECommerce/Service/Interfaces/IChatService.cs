using Service.DTO;
using System.Threading.Tasks;

namespace Service.Interfaces
{
    public interface IChatService
    {
        /// <summary>
        /// Answers a shopping question on behalf of one signed-in customer. The identity
        /// comes from the caller (JWT claims), never from the conversation.
        /// </summary>
        Task<ChatResponseDto> SendAsync(int userId, string role, ChatRequestDto dto);
    }
}

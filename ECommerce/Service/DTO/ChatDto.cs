using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Service.DTO
{
    public class ChatMessageDto
    {
        /// <summary>"user" or "assistant". Anything else is treated as "user".</summary>
        [Required]
        public string Role { get; set; } = string.Empty;

        [Required]
        [MaxLength(4000)]
        public string Content { get; set; } = string.Empty;
    }

    public class ChatRequestDto
    {
        [Required(ErrorMessage = "Message is required")]
        [MinLength(1)]
        [MaxLength(2000, ErrorMessage = "Message cannot exceed 2000 characters")]
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Prior turns of this conversation. The API is stateless, so the client sends
        /// the history back each time; only the most recent turns are forwarded to the model.
        /// </summary>
        public List<ChatMessageDto> History { get; set; } = new();
    }

    /// <summary>What the assistant looked up, so the UI can show "searched products" etc.</summary>
    public class ChatToolCallDto
    {
        public string Name { get; set; } = string.Empty;
        public string Input { get; set; } = string.Empty;
    }

    public class ChatResponseDto
    {
        public string Reply { get; set; } = string.Empty;
        public List<ChatToolCallDto> ToolCalls { get; set; } = new();
    }
}

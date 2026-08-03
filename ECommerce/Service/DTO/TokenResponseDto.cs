namespace Service.DTO;

public class TokenResponseDto
{
    public string Token { get; set; } = null!;
    public int ExpiresIn { get; set; }
}

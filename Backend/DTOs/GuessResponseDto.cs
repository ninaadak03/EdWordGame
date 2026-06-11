namespace Backend.DTOs;

public class GuessResponseDto
{
    public List<LetterResultDto> Letters { get; set; } = [];

    public bool IsWin { get; set; }

    public bool IsGameOver { get; set; }

    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public string? Answer { get; set; }
}
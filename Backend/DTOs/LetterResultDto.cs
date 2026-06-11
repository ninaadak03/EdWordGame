using Backend.Enums;

namespace Backend.DTOs;

public class LetterResultDto
{
    public char Letter { get; set; }

    public LetterStatus Status { get; set; }
}
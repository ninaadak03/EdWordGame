using Backend.DTOs;
using Backend.Enums;

namespace Backend.Services;

public class GameService : IGameService
{
    private readonly IWordService _wordService;

    public GameService(IWordService wordService)
    {
        _wordService = wordService;
    }

    public GuessResponseDto EvaluateGuess(string guess)
    {
        guess = guess.Trim().ToUpper();

        if (guess.Length != 5)
        {
            return new GuessResponseDto
            {
                Success = false,
                IsWin = false,
                IsGameOver = false,
                Message = "Guess must be exactly 5 letters."
            };
        }

        if (!guess.All(char.IsLetter))
        {
            return new GuessResponseDto
            {
                Success = false,
                IsWin = false,
                IsGameOver = false,
                Message = "Guess must contain only letters."
            };
        }

        if (!_wordService.IsValidGuess(guess))
        {
            return new GuessResponseDto
            {
                Success = false,
                IsWin = false,
                IsGameOver = false,
                Message = "Not in word list."
            };
        }

        var result = new List<LetterResultDto>();
        string targetWord = _wordService.GetTodaysWord();
        var targetChars = targetWord.ToCharArray();
        var letterCounts = new Dictionary<char, int>();

        // Build frequency map of target word letters
        foreach (var c in targetChars)
        {
            if (letterCounts.ContainsKey(c))
            {
                letterCounts[c]++;
            }
            else
            {
                letterCounts[c] = 1;
            }
        }

        // Initialize all letters as Absent
        for (int i = 0; i < guess.Length; i++)
        {
            result.Add(new LetterResultDto
            {
                Letter = guess[i],
                Status = LetterStatus.Absent
            });
        }

        // PASS 1: Mark Correct letters
        for (int i = 0; i < guess.Length; i++)
        {
            if (guess[i] == targetWord[i])
            {
                result[i].Status = LetterStatus.Correct;
                letterCounts[guess[i]]--;
            }
        }

        // PASS 2: Mark Present letters
        for (int i = 0; i < guess.Length; i++)
        {
            if (result[i].Status == LetterStatus.Correct)
            {
                continue;
            }

            char currentLetter = guess[i];

            if (letterCounts.ContainsKey(currentLetter) &&
                letterCounts[currentLetter] > 0)
            {
                result[i].Status = LetterStatus.Present;
                letterCounts[currentLetter]--;
            }
        }

        bool isWin = guess == targetWord;

        return new GuessResponseDto
        {
            Success = true,
            Letters = result,
            IsWin = isWin,
            IsGameOver = isWin,
            Message = isWin ? "Correct!" : "Try again!"
        };
    }
}
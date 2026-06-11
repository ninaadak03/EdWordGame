namespace Backend.Services;

public interface IWordService
{
    string GetTodaysWord();
    bool IsValidGuess(string guess);
    int GetPuzzleNumber();
}
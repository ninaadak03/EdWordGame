namespace Backend.Services;

public class WordService : IWordService
{
    private readonly List<string> _answers;
    private readonly HashSet<string> _allowedGuesses;

    public WordService()
    {
        _answers = File
            .ReadAllLines("Data/WordLists/answers.txt")
            .Select(w => w.Trim().ToUpper())
            .ToList();

        _allowedGuesses = File
            .ReadAllLines("Data/WordLists/allowed-guesses.txt")
            .Select(w => w.Trim().ToUpper())
            .ToHashSet();
    }

    public string GetTodaysWord()
    {
        var startDate = new DateTime(2026, 8, 1);
        var today = GetTodayInIST();
        var daysSinceStart = Math.Max(0, (today - startDate).Days);
        var index = daysSinceStart % _answers.Count;
        return _answers[index];
    }

    public bool IsValidGuess(string guess)
    {
        guess = guess.ToUpper();
        return _answers.Contains(guess) || _allowedGuesses.Contains(guess);
    }

    public int GetPuzzleNumber()
    {
        var startDate = new DateTime(2026, 8, 1);
        var today = GetTodayInIST();
        return Math.Max(0, (today - startDate).Days);
    }

    private static DateTime GetTodayInIST()
    {
        var istTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Kolkata");
        return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, istTimeZone).Date;
    }
}
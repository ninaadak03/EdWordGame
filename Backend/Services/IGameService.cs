using Backend.DTOs;

namespace Backend.Services;

public interface IGameService
{
    GuessResponseDto EvaluateGuess(string guess);
}
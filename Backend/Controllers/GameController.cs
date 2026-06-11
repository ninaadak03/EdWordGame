using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly IGameService _gameService;
    private readonly IWordService _wordService;

    public GameController(IGameService gameService, IWordService wordService)
    {
        _gameService = gameService;
        _wordService = wordService;
    }

    [HttpPost("guess")]
    public ActionResult<GuessResponseDto> Guess(GuessRequestDto request)
    {
        var response = _gameService.EvaluateGuess(request.Guess);

        return Ok(response);
    }

    [HttpGet("info")]
    public ActionResult<GameInfoDto> GetInfo()
    {
        return Ok(new GameInfoDto
        {
            PuzzleNumber = _wordService.GetPuzzleNumber()
        });
    }

    [HttpGet("answer")]
    public IActionResult GetAnswer()
    {
        return Ok(new
        {
            Answer = _wordService.GetTodaysWord()
        });
    }
}
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SavedGame } from '../../models/saved-game.model';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef,
  ) {
    console.log('Home constructor');
  }
  greeting = '';

  hasSavedGame = false;
  isCompletedGame = false;
  isWin = false;
  puzzleNumber = 0;
  todayDate = '';

  ngOnInit() {
    const hour = new Date().getHours();

    if (hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour < 18) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }

    this.todayDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    this.gameService.getInfo().subscribe((result) => {
      this.puzzleNumber = result.puzzleNumber;
      this.cdr.detectChanges();
    });

    const savedGame = localStorage.getItem('wordle-game');

    if (!savedGame) {
      return;
    }

    const gameState: SavedGame = JSON.parse(savedGame);

    this.hasSavedGame = gameState.currentRow > 0 || gameState.isGameOver;

    this.isCompletedGame = gameState.isGameOver;
    this.isWin = gameState.isWin;
  }
}

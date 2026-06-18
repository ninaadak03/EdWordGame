import { Component, HostListener, ChangeDetectorRef, OnInit } from '@angular/core';
import { BoardComponent } from '../../components/board/board';
import { KeyboardComponent } from '../../components/keyboard/keyboard';
import { HeaderComponent } from '../../components/header/header';
import { GameService } from '../../services/game.service';
import { Tile } from '../../models/tile.model';
import { SavedGame } from '../../models/saved-game.model';

@Component({
  selector: 'app-game',
  imports: [BoardComponent, KeyboardComponent, HeaderComponent],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class GameComponent implements OnInit {
  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef,
  ) {}

  isGameOver = false;
  isWin = false;
  showGameOverModal = false;

  isAnimating = false;

  toastMessage = '';
  showToast = false;

  shakeRow = -1;

  answer = '';

  puzzleNumber = 0;

  saveGame() {
    const gameState: SavedGame = {
      board: this.board.map((row) =>
        row.map((tile) => ({
          ...tile,
          isFlipping: false,
        })),
      ),
      keyStatuses: this.keyStatuses,

      currentRow: this.currentRow,
      currentCol: this.currentCol,

      isGameOver: this.isGameOver,
      isWin: this.isWin,
      puzzleNumber: this.puzzleNumber,

      answer: this.answer,
    };

    localStorage.setItem('wordle-game', JSON.stringify(gameState));
  }

  loadGame() {
    const savedGame = localStorage.getItem('wordle-game');

    if (!savedGame) {
      return;
    }

    const gameState: SavedGame = JSON.parse(savedGame);

    this.board = gameState.board;
    this.keyStatuses = gameState.keyStatuses;

    this.currentRow = gameState.currentRow;
    this.currentCol = gameState.currentCol;

    this.isGameOver = gameState.isGameOver;
    this.isWin = gameState.isWin;
    this.puzzleNumber = gameState.puzzleNumber;
    this.showGameOverModal = this.isGameOver;

    this.answer = gameState.answer;

    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.loadGame();

    if (this.puzzleNumber > 0) {
      return;
    }

    this.gameService.getInfo().subscribe((info) => {
      this.puzzleNumber = info.puzzleNumber;

      this.saveGame();

      this.cdr.detectChanges();
    });
  }

  newGame() {
    location.reload();
  }

  closeGameOverModal() {
    this.showGameOverModal = false;
  }

  async shareResults() {
    const text = this.buildShareText();

    try {
      const isMobile = window.innerWidth <= 768;

      if (isMobile && navigator.share) {
        await navigator.share({
          text,
        });

        return;
      }

      await navigator.clipboard.writeText(text);

      this.toastMessage = 'Results copied!';
      this.showToast = true;

      this.cdr.detectChanges();

      setTimeout(() => {
        this.showToast = false;
        this.cdr.detectChanges();
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  buildShareText(): string {
    const rows: string[] = [];

    for (const row of this.board) {
      const completedRow = row.every((tile) => tile.status !== null);

      if (!completedRow) {
        continue;
      }

      let rowText = '';

      for (const tile of row) {
        switch (tile.status) {
          case 2:
            rowText += '🟩';
            break;

          case 1:
            rowText += '🟨';
            break;

          default:
            rowText += '⬛';
            break;
        }
      }

      rows.push(rowText);
    }
    return `EdWord #${this.puzzleNumber}
${rows.join('\n')}`;
  }

  board: Tile[][] = Array.from({ length: 6 }, () =>
    Array.from(
      { length: 5 },
      (): Tile => ({
        letter: '',
        status: null,
        isFlipping: false,
      }),
    ),
  );

  keyStatuses: Record<string, number> = {};

  currentRow = 0;
  currentCol = 0;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.isGameOver || this.isAnimating) {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (this.currentRow >= this.board.length) {
      return;
    }

    if (event.key === 'Backspace') {
      if (this.currentCol === 0) {
        return;
      }

      this.currentCol--;

      this.board[this.currentRow][this.currentCol].letter = '';
      this.board[this.currentRow][this.currentCol].status = null;

      return;
    }

    if (event.key === 'Enter') {
      if (this.currentCol < 5) {
        return;
      }

      const guess = this.board[this.currentRow].map((tile) => tile.letter).join('');

      this.gameService.submitGuess(guess).subscribe((response) => {
        console.log(response);

        if (!response.success) {
          this.toastMessage = 'Not a valid word :(';
          this.showToast = true;

          this.shakeRow = this.currentRow;

          this.cdr.detectChanges();

          setTimeout(() => {
            this.showToast = false;
            this.cdr.detectChanges();
          }, 2000);

          setTimeout(() => {
            this.shakeRow = -1;
            this.cdr.detectChanges();
          }, 600);

          return;
        }

        this.isAnimating = true;

        const FLIP_DURATION = 350;
        const STAGGER = 350;

        for (let i = 0; i < 5; i++) {
          const tile = this.board[this.currentRow][i];

          setTimeout(() => {
            tile.isFlipping = true;
            this.cdr.detectChanges();

            setTimeout(() => {
              tile.status = response.letters[i].status;
              this.cdr.detectChanges();
            }, FLIP_DURATION / 2);

            setTimeout(() => {
              tile.isFlipping = false;
              this.cdr.detectChanges();
            }, FLIP_DURATION);
          }, i * STAGGER);
        }

        const totalAnimationTime = (5 - 1) * STAGGER + FLIP_DURATION;

        setTimeout(() => {
          for (let i = 0; i < 5; i++) {
            const letter = response.letters[i].letter;
            const status = response.letters[i].status;

            this.keyStatuses[letter] = Math.max(this.keyStatuses[letter] ?? -1, status);
          }

          this.keyStatuses = { ...this.keyStatuses };

          this.isWin = response.isWin;

          this.isGameOver = response.isWin || this.currentRow === 5;

          if (this.isGameOver) {
            this.showGameOverModal = true;
          }

          if (this.currentRow === 5 && !response.isWin) {
            this.gameService.getAnswer().subscribe((result) => {
              this.answer = result.answer;
              this.saveGame();
              this.cdr.detectChanges();
            });
          }

          if (!this.isGameOver) {
            this.currentRow++;
            this.currentCol = 0;
          }

          this.saveGame();

          this.isAnimating = false;

          this.cdr.detectChanges();
        }, totalAnimationTime);
      });

      return;
    }

    const key = event.key.toUpperCase();

    if (!/^[A-Z]$/.test(key)) {
      return;
    }

    if (this.currentCol >= 5) {
      return;
    }

    this.board[this.currentRow][this.currentCol].letter = key;

    this.currentCol++;
  }

  handleVirtualKey(key: string) {
    this.handleKeyDown({
      key,
    } as KeyboardEvent);
  }
}

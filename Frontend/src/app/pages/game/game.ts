import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { BoardComponent } from '../../components/board/board';
import { KeyboardComponent } from '../../components/keyboard/keyboard';
import { GameService } from '../../services/game.service';
import { Tile } from '../../models/tile.model';

@Component({
  selector: 'app-game',
  imports: [BoardComponent, KeyboardComponent],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class GameComponent {
  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef,
  ) {}

  isGameOver = false;
  isWin = false;

  toastMessage = '';
  showToast = false;

  shakeRow = -1;

  answer = '';

  newGame() {
    location.reload();
  }

  board: Tile[][] = Array.from({ length: 6 }, () =>
    Array.from(
      { length: 5 },
      (): Tile => ({
        letter: '',
        status: null,
      }),
    ),
  );

  keyStatuses: Record<string, number> = {};

  currentRow = 0;
  currentCol = 0;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.isGameOver) {
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

        const row = [...this.board[this.currentRow]];

        for (let i = 0; i < 5; i++) {
          row[i] = {
            ...row[i],
            status: response.letters[i].status,
          };
        }

        this.board[this.currentRow] = row;
        this.board = [...this.board];

        for (let i = 0; i < 5; i++) {
          const letter = response.letters[i].letter;
          const status = response.letters[i].status;

          this.keyStatuses[letter] = Math.max(this.keyStatuses[letter] ?? -1, status);
        }

        this.keyStatuses = { ...this.keyStatuses };

        this.isWin = response.isWin;
        this.isGameOver = response.isWin || this.currentRow === 5;

        if (this.currentRow === 5 && !response.isWin) {
          this.gameService.getAnswer().subscribe((result) => {
            this.answer = result.answer;
            this.cdr.detectChanges();
          });
        }

        this.cdr.detectChanges();

        if (!this.isGameOver) {
          this.currentRow++;
          this.currentCol = 0;
        }
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

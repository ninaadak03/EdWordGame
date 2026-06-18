import { Tile } from './tile.model';

export interface SavedGame {
  board: Tile[][];
  keyStatuses: Record<string, number>;

  currentRow: number;
  currentCol: number;

  isGameOver: boolean;
  isWin: boolean;
  puzzleNumber: number;
  answer: string;
}

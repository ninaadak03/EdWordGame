import { LetterResult } from './letter-result.model';

export interface GuessResponse {
  success: boolean;
  isWin: boolean;
  isGameOver: boolean;
  message: string;
  letters: LetterResult[];
}

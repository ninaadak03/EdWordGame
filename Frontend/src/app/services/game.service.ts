import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { GuessResponse } from '../models/guess-response.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  submitGuess(guess: string): Observable<GuessResponse> {
    return this.http.post<GuessResponse>(`${this.apiUrl}/guess`, {
      guess,
    });
  }

  getAnswer(): Observable<{ answer: string }> {
    return this.http.get<{ answer: string }>(`${this.apiUrl}/answer`);
  }

  getInfo(): Observable<{ puzzleNumber: number }> {
    return this.http.get<{ puzzleNumber: number }>(`${this.apiUrl}/info`);
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Tile } from '../../models/tile.model';

@Component({
  selector: 'app-board',
  imports: [CommonModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class BoardComponent {
  @Input()
  board!: Tile[][];

  @Input() shakeRow = -1;
}

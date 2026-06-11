import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  imports: [CommonModule],
  templateUrl: './keyboard.html',
  styleUrl: './keyboard.css',
})
export class KeyboardComponent {
  @Input() keyStatuses: Record<string, number> = {};

  @Output() keyPressed = new EventEmitter<string>();

  row1 = 'QWERTYUIOP'.split('');
  row2 = 'ASDFGHJKL'.split('');
  row3 = 'ZXCVBNM'.split('');

  emitKey(key: string) {
    this.keyPressed.emit(key);
  }
}

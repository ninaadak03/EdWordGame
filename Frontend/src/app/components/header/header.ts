import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit {
  @Input() puzzleNumber = 0;
  showInstructions = false;
  isDarkMode = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('dark-mode');

    this.isDarkMode = savedTheme === 'true';

    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  openInstructions() {
    this.showInstructions = true;
  }

  closeInstructions() {
    this.showInstructions = false;
  }

  toggleDarkMode(event: Event) {
    this.isDarkMode = !this.isDarkMode;

    localStorage.setItem('dark-mode', String(this.isDarkMode));

    document.body.classList.toggle('dark-mode', this.isDarkMode);

    (event.target as HTMLElement).blur();
  }
}

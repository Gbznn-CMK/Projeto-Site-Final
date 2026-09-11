import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initializeMockData } from './core/data/mock-data';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('NaHora Serv');

  ngOnInit() {
    // Initialize mock data to localStorage on app startup
    initializeMockData();
  }
}


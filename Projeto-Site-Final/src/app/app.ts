import { Component, signal, OnInit } from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { initializeMockData } from './core/data/mock-data';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('NaHora Serv');
  readonly isTransitioning = signal(false);

  private initialNavigationCompleted = false;

  constructor(private readonly router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.initialNavigationCompleted = true;
      }

      if (
        event instanceof NavigationStart &&
        this.initialNavigationCompleted
      ) {
        this.startTransition();
      }
    });
  }

  ngOnInit() {
    // Initialize mock data to localStorage on app startup
    initializeMockData();
  }

  finishTransition(): void {
    this.isTransitioning.set(false);
  }

  private startTransition(): void {
    this.isTransitioning.set(false);
    requestAnimationFrame(() => this.isTransitioning.set(true));
  }
}


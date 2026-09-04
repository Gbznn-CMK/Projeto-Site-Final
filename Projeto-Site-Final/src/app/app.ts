import { Component, signal } from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
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

  finishTransition(): void {
    this.isTransitioning.set(false);
  }

  private startTransition(): void {
    this.isTransitioning.set(false);

    setTimeout(() => {
      this.isTransitioning.set(true);
    });
  }
}
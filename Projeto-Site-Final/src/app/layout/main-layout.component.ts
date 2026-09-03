import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/components/header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-container">
      <app-sidebar></app-sidebar>
      <div class="app-wrapper">
        <app-header></app-header>
        <main class="app-main">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .app-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 250px;
      min-width: 0;
    }

    .app-main {
      flex: 1;
      overflow-y: auto;
      padding: clamp(1.25rem, 3vw, 2.5rem);
      margin-top: 68px;
      background-color: var(--color-neutral-50);
    }

    @media (max-width: 768px) {
      .app-wrapper {
        margin-left: 80px;
      }
    }
  `]
})
export class MainLayoutComponent {}

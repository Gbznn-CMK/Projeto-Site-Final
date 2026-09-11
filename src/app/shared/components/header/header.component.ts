import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/types';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <header class="header">
      <div class="header-left">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Buscar prestadores, serviços..." 
            class="search-input"
            [(ngModel)]="searchTerm"
            (keyup.enter)="search()"
          >
          <button class="search-btn" (click)="search()" aria-label="Buscar">🔍</button>
        </div>
      </div>

      <div class="header-right">
        <button class="icon-btn" title="Notificações">
          <span class="icon">🔔</span>
          <span class="badge">2</span>
        </button>
        
        <div class="profile-dropdown">
          <button class="profile-btn">
            <span class="avatar">{{ getUserInitials() }}</span>
            <span class="name" *ngIf="currentUser">{{ currentUser.nome }}</span>
          </button>
          <div class="dropdown-menu">
            <a routerLink="/configuracoes" class="dropdown-item">⚙️ Configurações</a>
            <button (click)="logout()" class="dropdown-item logout">🚪 Sair</button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 68px;
      background-color: rgba(255, 255, 255, 0.96);
      border-bottom: 1px solid var(--color-neutral-200);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 clamp(1rem, 3vw, 2.5rem);
      margin-left: 0;
      position: fixed;
      right: 0;
      top: 0;
      z-index: 999;
      transition: margin-left var(--transition-base);
    }

    .header-left {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .search-box {
      display: flex;
      align-items: center;
      background-color: var(--color-neutral-100);
      border: 1px solid var(--color-neutral-200);
      border-radius: var(--radius-full);
      padding: 0.15rem;
      max-width: 520px;
      width: 100%;
    }

    .search-input {
      flex: 1;
      border: none;
      background: none;
      padding: 0.7rem 1rem;
      font-size: var(--font-size-sm);
    }

    .search-input:focus {
      outline: none;
    }

    .search-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
      padding: var(--space-xs) var(--space-md);
      color: var(--color-primary);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
    }

    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.35rem;
      position: relative;
      padding: var(--space-sm);
      color: var(--color-primary-dark);
    }

    .badge {
      position: absolute;
      top: 0;
      right: 0;
      background-color: var(--color-danger);
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
    }

    .profile-dropdown {
      position: relative;
    }

    .profile-btn {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      background: none;
      border: 1px solid transparent;
      border-radius: var(--radius-full);
      padding: var(--space-xs);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .profile-btn:hover {
      border-color: var(--color-primary);
      background-color: var(--color-neutral-50);
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: var(--color-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-sm);
    }

    .name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-neutral-900);
    }

    .dropdown-menu {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: var(--space-sm);
      background-color: white;
      border: 1px solid var(--color-neutral-200);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      min-width: 200px;
      display: none;
      flex-direction: column;
      z-index: 1100;
    }

    .profile-dropdown:hover .dropdown-menu {
      display: flex;
    }

    .dropdown-item {
      padding: var(--space-md) var(--space-lg);
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      color: var(--color-neutral-900);
      text-decoration: none;
      transition: background-color var(--transition-base);
      font-size: var(--font-size-sm);
    }

    .dropdown-item:hover {
      background-color: var(--color-neutral-100);
    }

    .dropdown-item.logout {
      color: var(--color-danger);
      border-top: 1px solid var(--color-neutral-200);
    }

    .dropdown-item.logout:hover {
      background-color: #ffe0e0;
    }

    @media (max-width: 768px) {
      .header {
        margin-left: 0;
      }

      .search-box {
        display: none;
      }

      .name {
        display: none;
      }

      .header-right {
        gap: var(--space-md);
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: Usuario | null = null;
  searchTerm = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  search() {
    const query = this.searchTerm.trim();
    this.router.navigate(['/prestadores'], {
      queryParams: query ? { busca: query } : {}
    });
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const names = this.currentUser.nome.split(' ');
    return (names[0][0] + (names[1]?.[0] || '')).toUpperCase();
  }

  logout() {
    if (confirm('Tem certeza que deseja sair?')) {
      this.authService.logout();
      window.location.href = '/login';
    }
  }
}

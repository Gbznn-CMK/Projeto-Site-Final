import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario, TipoUsuario } from '../../../core/models/types';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed()">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">📅</span>
          <span class="logo-text" *ngIf="!isCollapsed()">NaHora Serv</span>
        </div>
        <button class="toggle-btn" (click)="toggleCollapse()">
          {{ isCollapsed() ? '→' : '←' }}
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section" *ngIf="isClient()">
          <h3 class="nav-title" *ngIf="!isCollapsed()">Cliente</h3>
          <a routerLink="/inicio" routerLinkActive="active" class="nav-link">
            <span class="icon">🏠</span>
            <span class="label" *ngIf="!isCollapsed()">Início</span>
          </a>
          <a routerLink="/prestadores" routerLinkActive="active" class="nav-link">
            <span class="icon">🔍</span>
            <span class="label" *ngIf="!isCollapsed()">Buscar</span>
          </a>
          <a routerLink="/meus-agendamentos" routerLinkActive="active" class="nav-link">
            <span class="icon">📋</span>
            <span class="label" *ngIf="!isCollapsed()">Agendamentos</span>
          </a>
          <a routerLink="/favoritos" routerLinkActive="active" class="nav-link">
            <span class="icon">⭐</span>
            <span class="label" *ngIf="!isCollapsed()">Favoritos</span>
          </a>
        </div>

        <div class="nav-section" *ngIf="isProvider()">
          <h3 class="nav-title" *ngIf="!isCollapsed()">Prestador</h3>
          <a routerLink="/painel" routerLinkActive="active" class="nav-link">
            <span class="icon">📊</span>
            <span class="label" *ngIf="!isCollapsed()">Painel</span>
          </a>
          <a routerLink="/minha-agenda" routerLinkActive="active" class="nav-link">
            <span class="icon">📅</span>
            <span class="label" *ngIf="!isCollapsed()">Agenda</span>
          </a>
          <a routerLink="/meus-servicos" routerLinkActive="active" class="nav-link">
            <span class="icon">🛠️</span>
            <span class="label" *ngIf="!isCollapsed()">Serviços</span>
          </a>
          <a routerLink="/disponibilidade" routerLinkActive="active" class="nav-link">
            <span class="icon">⏰</span>
            <span class="label" *ngIf="!isCollapsed()">Disponibilidade</span>
          </a>
        </div>

        <div class="nav-section">
          <h3 class="nav-title" *ngIf="!isCollapsed()">Suporte</h3>
          <a routerLink="/sac" routerLinkActive="active" class="nav-link">
            <span class="icon">💬</span>
            <span class="label" *ngIf="!isCollapsed()">SAC</span>
          </a>
          <a routerLink="/configuracoes" routerLinkActive="active" class="nav-link">
            <span class="icon">⚙️</span>
            <span class="label" *ngIf="!isCollapsed()">Configurações</span>
          </a>
        </div>
      </nav>

      <div class="sidebar-footer" *ngIf="!isCollapsed()">
        <div class="user-info" *ngIf="currentUser()">
          <div class="user-avatar">{{ getUserInitials() }}</div>
          <div class="user-details">
            <p class="user-name">{{ currentUser()?.nome }}</p>
            <p class="user-type">{{ getUserTypeLabel() }}</p>
          </div>
        </div>
        <button class="logout-btn" (click)="logout()">Sair</button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background-color: var(--color-primary-dark);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      transition: width var(--transition-base);
      overflow-y: auto;
    }

    .sidebar.collapsed {
      width: 80px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.15rem var(--space-lg);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-lg);
    }

    .logo-icon {
      font-size: 1.5rem;
    }

    .logo-text {
      white-space: nowrap;
    }

    .toggle-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: var(--font-size-lg);
      padding: var(--space-xs);
      transition: transform var(--transition-base);
    }

    .toggle-btn:hover {
      transform: scale(1.2);
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--space-xl) 0;
      overflow-y: auto;
    }

    .nav-section {
      margin-bottom: var(--space-lg);
    }

    .nav-title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 0 var(--space-lg);
      margin-bottom: var(--space-md);
      color: rgba(255, 255, 255, 0.7);
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: 0.75rem var(--space-lg);
      color: rgba(255, 255, 255, 0.8);
      transition: all var(--transition-base);
      text-decoration: none;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: white;
    }

    .nav-link.active {
      background-color: var(--color-success);
      color: white;
      border-left: 4px solid white;
      padding-left: calc(var(--space-lg) - 4px);
    }

    .icon {
      font-size: 1.25rem;
      min-width: 30px;
      text-align: center;
    }

    .label {
      white-space: nowrap;
    }

    .sidebar-footer {
      padding: var(--space-lg);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .user-info {
      display: flex;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--color-success);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      flex-shrink: 0;
    }

    .user-details {
      flex: 1;
    }

    .user-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      margin: 0;
    }

    .user-type {
      font-size: var(--font-size-xs);
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }

    .logout-btn {
      width: 100%;
      background-color: var(--color-danger);
      color: white;
      padding: var(--space-md);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: var(--font-weight-semibold);
      transition: background-color var(--transition-base);
    }

    .logout-btn:hover {
      background-color: var(--color-danger-light);
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 80px;
      }

      .sidebar-header {
        padding: var(--space-md);
      }

      .toggle-btn {
        display: none;
      }

      .nav-link {
        justify-content: center;
        padding: var(--space-md);
      }

      .icon {
        margin: 0;
      }

      .sidebar-footer {
        display: none;
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  isCollapsed = signal(false);
  currentUser = signal<Usuario | null>(null);

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser.set(user);
    });
  }

  toggleCollapse() {
    this.isCollapsed.update(val => !val);
  }

  isClient(): boolean {
    return this.authService.isUserType('cliente');
  }

  isProvider(): boolean {
    return this.authService.isUserType('prestador');
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return '';
    const names = user.nome.split(' ');
    return (names[0][0] + (names[1]?.[0] || '')).toUpperCase();
  }

  getUserTypeLabel(): string {
    const role = this.authService.getUserRole();
    switch (role) {
      case 'cliente':
        return 'Cliente';
      case 'prestador':
        return 'Prestador';
      case 'admin':
        return 'Administrador';
      default:
        return '';
    }
  }

  logout() {
    if (confirm('Tem certeza que deseja sair?')) {
      this.authService.logout();
      window.location.href = '/login';
    }
  }
}

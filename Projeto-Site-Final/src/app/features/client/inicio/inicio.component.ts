import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Usuario, Prestador } from '../../../core/models/types';
import { AuthService } from '../../../core/services/auth.service';
import { PrestadorService } from '../../../core/services/prestador.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ProviderCardComponent } from '../../../shared/components/provider-card/provider-card.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, ProviderCardComponent],
  template: `
    <section class="home-page">
      <section class="welcome-panel">
        <div>
          <p class="eyebrow">NaHora Serv</p>
          <h1>Olá, {{ currentUser?.nome?.split(' ')?.[0] || 'seja bem-vindo' }}.</h1>
          <p>Seu próximo atendimento pode começar com uma escolha simples.</p>
        </div>
        <a class="btn btn-success" routerLink="/prestadores">Encontrar um serviço</a>
      </section>

      <section class="quick-actions" aria-label="Acessos rápidos">
        <a class="action-item" routerLink="/prestadores">
          <span class="action-icon">⌕</span>
          <span><strong>Buscar prestadores</strong><small>Encontre profissionais perto de você</small></span>
        </a>
        <a class="action-item" routerLink="/meus-agendamentos">
          <span class="action-icon">◷</span>
          <span><strong>Meus agendamentos</strong><small>Veja seus próximos horários</small></span>
        </a>
      </section>

      <section class="featured-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Para você</p>
            <h2>Prestadores em destaque</h2>
          </div>
          <a routerLink="/prestadores">Ver todos</a>
        </div>

        <p class="loading-state" *ngIf="loading">Carregando recomendações...</p>
        <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>
        <div class="provider-grid" *ngIf="!loading && !errorMessage">
          <app-provider-card *ngFor="let prestador of featuredProviders" [provider]="prestador" [isFavorited]="isFavorite(prestador.id)" (toggleFav)="toggleFavorite(prestador.id)"></app-provider-card>
        </div>
      </section>
    </section>
  `,
  styles: [`
    .home-page {
      max-width: 1280px;
      margin: 0 auto;
    }

    .welcome-panel {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: var(--space-xl);
      padding: var(--space-2xl);
      margin-bottom: var(--space-lg);
      border-radius: var(--radius-lg);
      background: linear-gradient(120deg, var(--color-primary-dark), var(--color-primary));
      color: white;
      box-shadow: var(--shadow-lg);
    }

    .welcome-panel h1 {
      margin: 0 0 var(--space-sm);
      color: white;
    }

    .welcome-panel p:not(.eyebrow) {
      margin: 0;
      color: rgba(255, 255, 255, 0.82);
    }

    .eyebrow {
      color: var(--color-success-dark);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      margin: 0 0 var(--space-xs);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .welcome-panel .eyebrow {
      color: #9effc2;
    }

    .btn {
      display: inline-block;
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-bold);
      white-space: nowrap;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-md);
      margin-bottom: var(--space-2xl);
    }

    .action-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg);
      color: var(--color-neutral-900);
      background: white;
      border: 1px solid var(--color-neutral-200);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    .action-item:hover {
      border-color: var(--color-primary);
      color: var(--color-neutral-900);
    }

    .action-icon {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      color: white;
      background: var(--color-primary);
      font-size: var(--font-size-2xl);
    }

    .action-item span:last-child {
      display: grid;
      gap: var(--space-xs);
    }

    .action-item small {
      color: var(--color-neutral-600);
    }

    .section-heading {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: var(--space-lg);
      margin-bottom: var(--space-lg);
    }

    .section-heading h2 {
      margin: 0;
    }

    .provider-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: var(--space-lg);
    }

    .loading-state,
    .error-message {
      padding: var(--space-lg);
      text-align: center;
    }

    .error-message {
      color: var(--color-danger-dark);
    }

    @media (max-width: 768px) {
      .welcome-panel {
        align-items: start;
        flex-direction: column;
        padding: var(--space-xl);
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InicioComponent implements OnInit {
  currentUser: Usuario | null = null;
  featuredProviders: Prestador[] = [];
  loading = true;
  errorMessage = '';
  private userId = '';
  private favoriteIds = new Set<string>();

  constructor(
    private authService: AuthService,
    private prestadorService: PrestadorService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.userId = user.id;
        this.usuarioService.getFavorites(user.id).subscribe(ids => this.favoriteIds = new Set(ids));
      }
    });

    this.prestadorService.getAll().subscribe({
      next: prestadores => {
        this.featuredProviders = prestadores.slice(0, 3);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar as recomendações.';
        this.loading = false;
      }
    });
  }

  isFavorite(prestadorId: string) {
    return this.favoriteIds.has(prestadorId);
  }

  toggleFavorite(prestadorId: string) {
    if (!this.userId) return;
    const wasFavorite = this.favoriteIds.has(prestadorId);
    wasFavorite ? this.favoriteIds.delete(prestadorId) : this.favoriteIds.add(prestadorId);
    this.favoriteIds = new Set(this.favoriteIds);
    this.usuarioService.toggleFavorite(this.userId, prestadorId).subscribe({
      error: () => {
        wasFavorite ? this.favoriteIds.add(prestadorId) : this.favoriteIds.delete(prestadorId);
        this.favoriteIds = new Set(this.favoriteIds);
        this.errorMessage = 'Não foi possível atualizar o favorito.';
      }
    });
  }
}

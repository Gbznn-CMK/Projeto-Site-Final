import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Prestador } from '../../../core/models/types';
import { AuthService } from '../../../core/services/auth.service';
import { PrestadorService } from '../../../core/services/prestador.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ProviderCardComponent } from '../../../shared/components/provider-card/provider-card.component';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, ProviderCardComponent],
  template: `
    <section class="favorites-page">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Sua seleção</p>
          <h1>Favoritos</h1>
          <p class="subtitle">Acesse rapidamente os prestadores que você quer acompanhar.</p>
        </div>
        <a class="btn btn-primary" routerLink="/prestadores">Explorar prestadores</a>
      </div>

      <p class="loading-state" *ngIf="loading">Carregando favoritos...</p>
      <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>
      <div class="provider-grid" *ngIf="!loading && !errorMessage && providers.length">
        <app-provider-card
          *ngFor="let provider of providers"
          [provider]="provider"
          [isFavorited]="true"
          (toggleFav)="removeFavorite(provider.id)"
        ></app-provider-card>
      </div>
      <div class="empty-state" *ngIf="!loading && !errorMessage && !providers.length">
        <h2>Nenhum favorito ainda</h2>
        <p>Guarde seus prestadores preferidos para encontrá-los mais rápido.</p>
        <a class="btn btn-success" routerLink="/prestadores">Encontrar prestadores</a>
      </div>
    </section>
  `,
  styles: [`
    .favorites-page { max-width: 1280px; margin: 0 auto; }
    .page-heading { display: flex; align-items: end; justify-content: space-between; gap: var(--space-lg); margin-bottom: var(--space-2xl); }
    .eyebrow { color: var(--color-success-dark); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); margin: 0 0 var(--space-xs); text-transform: uppercase; letter-spacing: 0.08em; }
    h1 { margin: 0 0 var(--space-xs); }
    .subtitle { color: var(--color-neutral-600); margin: 0; }
    .btn { display: inline-block; padding: var(--space-md) var(--space-lg); border-radius: var(--radius-md); font-weight: var(--font-weight-bold); white-space: nowrap; }
    .provider-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-lg); }
    .loading-state, .empty-state { padding: var(--space-3xl) var(--space-lg); text-align: center; color: var(--color-neutral-600); }
    .empty-state h2 { color: var(--color-neutral-900); margin-bottom: var(--space-sm); }
    .empty-state p { margin-bottom: var(--space-lg); }
    .error-message { padding: var(--space-md); color: var(--color-danger-dark); background: #fff1f0; border-radius: var(--radius-md); }
    @media (max-width: 640px) { .page-heading { align-items: start; flex-direction: column; } .page-heading .btn { width: 100%; text-align: center; } }
  `]
})
export class FavoritosComponent implements OnInit {
  providers: Prestador[] = [];
  loading = true;
  errorMessage = '';
  private userId = '';

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private prestadorService: PrestadorService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (!user) {
        this.errorMessage = 'Faça login para ver seus favoritos.';
        this.loading = false;
        return;
      }

      this.userId = user.id;
      this.loadFavorites();
    });
  }

  private loadFavorites() {
    this.usuarioService.getFavorites(this.userId).subscribe(favoriteIds => {
      if (!favoriteIds.length) {
        this.loading = false;
        return;
      }

      this.prestadorService.getAll().subscribe({
        next: providers => {
          const favorites = new Set(favoriteIds);
          this.providers = providers.filter(provider => favorites.has(provider.id));
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Não foi possível carregar seus favoritos.';
          this.loading = false;
        }
      });
    });
  }

  removeFavorite(prestadorId: string) {
    this.usuarioService.toggleFavorite(this.userId, prestadorId).subscribe({
      next: () => {
        this.providers = this.providers.filter(provider => provider.id !== prestadorId);
      },
      error: () => {
        this.errorMessage = 'Não foi possível remover este favorito.';
      }
    });
  }
}

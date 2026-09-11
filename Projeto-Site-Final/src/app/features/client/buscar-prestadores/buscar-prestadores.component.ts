import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Prestador } from '../../../core/models/types';
import { PrestadorService } from '../../../core/services/prestador.service';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ProviderCardComponent } from '../../../shared/components/provider-card/provider-card.component';

@Component({
  selector: 'app-buscar-prestadores',
  standalone: true,
  imports: [CommonModule, FormsModule, ProviderCardComponent],
  template: `
    <section class="search-page">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Encontre seu próximo atendimento</p>
          <h1>Buscar prestadores</h1>
          <p class="subtitle">Compare opções e escolha o serviço que combina com você.</p>
        </div>
        <span class="result-count" *ngIf="!loading">{{ prestadores.length }} resultados</span>
      </div>

      <form class="filters" (ngSubmit)="search()">
        <label class="filter-field search-field">
          <span>O que você procura?</span>
          <input
            type="search"
            name="query"
            [(ngModel)]="query"
            placeholder="Nome ou descrição"
          >
        </label>

        <label class="filter-field">
          <span>Categoria</span>
          <select name="categoria" [(ngModel)]="categoria">
            <option value="">Todas as categorias</option>
            <option *ngFor="let option of categorias" [value]="option">{{ option }}</option>
          </select>
        </label>

        <label class="filter-field">
          <span>Localização</span>
          <input
            type="search"
            name="localizacao"
            [(ngModel)]="localizacao"
            placeholder="Cidade, bairro ou endereço"
          >
        </label>

        <label class="filter-field">
          <span>Ordenar por</span>
          <select name="ordenacao" [(ngModel)]="ordenacao">
            <option value="relevancia">Relevancia</option>
            <option value="nome">Nome</option>
          </select>
        </label>

        <label class="favorite-filter">
          <input type="checkbox" name="apenasFavoritos" [(ngModel)]="apenasFavoritos" (change)="search()">
          <span>Somente favoritos</span>
        </label>

        <button class="btn btn-primary filter-button" type="submit">Buscar</button>
      </form>

      <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>
      <div class="loading-state" *ngIf="loading">Carregando prestadores...</div>

      <div class="provider-grid" *ngIf="!loading && prestadores.length">
        <app-provider-card
          *ngFor="let prestador of prestadores"
          [provider]="prestador"
          [isFavorited]="isFavorite(prestador.id)"
          (toggleFav)="toggleFavorite(prestador.id)"
        ></app-provider-card>
      </div>

      <div class="empty-state" *ngIf="!loading && !prestadores.length">
        <h2>Nenhum prestador encontrado</h2>
        <p>Tente remover um filtro ou buscar por outro termo.</p>
        <button class="btn btn-secondary" type="button" (click)="clearFilters()">Limpar filtros</button>
      </div>
    </section>
  `,
  styles: [`
    .search-page {
      max-width: 1280px;
      margin: 0 auto;
    }

    .page-heading {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .eyebrow {
      color: var(--color-success-dark);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      margin: 0 0 var(--space-xs);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    h1 {
      margin: 0 0 var(--space-xs);
    }

    .subtitle {
      color: var(--color-neutral-600);
      margin: 0;
    }

    .result-count {
      color: var(--color-neutral-600);
      font-size: var(--font-size-sm);
      white-space: nowrap;
    }

    .filters {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1.2fr 1fr auto;
      align-items: end;
      gap: var(--space-md);
      padding: var(--space-lg);
      margin-bottom: var(--space-xl);
      background: white;
      border: 1px solid var(--color-neutral-200);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    .filter-field {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .filter-field span {
      color: var(--color-neutral-700);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
    }

    .filter-button {
      min-height: 44px;
    }

    .favorite-filter {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      min-height: 44px;
      color: var(--color-neutral-700);
      font-size: var(--font-size-sm);
      white-space: nowrap;
    }

    .provider-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: var(--space-lg);
    }

    .loading-state,
    .empty-state {
      padding: var(--space-3xl) var(--space-lg);
      text-align: center;
      color: var(--color-neutral-600);
    }

    .empty-state h2 {
      color: var(--color-neutral-900);
      margin-bottom: var(--space-sm);
    }

    .empty-state p {
      margin-bottom: var(--space-lg);
    }

    .error-message {
      color: var(--color-danger-dark);
      background: #fff1f0;
      border: 1px solid #ffcdd2;
      border-radius: var(--radius-md);
      padding: var(--space-md);
    }

    @media (max-width: 768px) {
      .page-heading {
        align-items: start;
        flex-direction: column;
      }

      .filters {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BuscarPrestadoresComponent implements OnInit {
  prestadores: Prestador[] = [];
  categorias: string[] = [];
  query = '';
  categoria = '';
  localizacao = '';
  ordenacao: 'relevancia' | 'nome' = 'relevancia';
  apenasFavoritos = false;
  loading = false;
  errorMessage = '';
  private userId = '';
  private favoriteIds = new Set<string>();

  constructor(
    private prestadorService: PrestadorService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (!user) return;
      this.userId = user.id;
      this.usuarioService.getFavorites(user.id).subscribe(ids => this.favoriteIds = new Set(ids));
    });

    this.prestadorService.getCategories().subscribe(categories => {
      this.categorias = categories;
    });

    this.route.queryParams.subscribe(params => {
      this.query = params['busca'] || '';
      this.search();
    });
  }

  search() {
    this.loading = true;
    this.errorMessage = '';

    this.prestadorService.search(
      this.query.trim(),
      this.categoria,
      this.localizacao.trim()
    ).subscribe({
      next: prestadores => {
        this.prestadores = this.aplicarFiltros(prestadores);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os prestadores.';
        this.loading = false;
      }
    });
  }

  clearFilters() {
    this.query = '';
    this.categoria = '';
    this.localizacao = '';
    this.ordenacao = 'relevancia';
    this.apenasFavoritos = false;
    this.search();
  }

  private aplicarFiltros(prestadores: Prestador[]) {
    const filtrados = this.apenasFavoritos
      ? prestadores.filter(prestador => this.favoriteIds.has(prestador.id))
      : prestadores;

    if (this.ordenacao === 'nome') {
      return [...filtrados].sort((a, b) =>
        a.nomeEstabelecimento.localeCompare(b.nomeEstabelecimento, 'pt-BR')
      );
    }

    return filtrados;
  }

  isFavorite(prestadorId: string) {
    return this.favoriteIds.has(prestadorId);
  }

  toggleFavorite(prestadorId: string) {
    if (!this.userId) return;
    const wasFavorite = this.favoriteIds.has(prestadorId);
    wasFavorite ? this.favoriteIds.delete(prestadorId) : this.favoriteIds.add(prestadorId);
    this.favoriteIds = new Set(this.favoriteIds);
    this.prestadores = this.aplicarFiltros(this.prestadores);
    this.usuarioService.toggleFavorite(this.userId, prestadorId).subscribe({
      error: () => {
        wasFavorite ? this.favoriteIds.add(prestadorId) : this.favoriteIds.delete(prestadorId);
        this.favoriteIds = new Set(this.favoriteIds);
        this.prestadores = this.aplicarFiltros(this.prestadores);
        this.errorMessage = 'Não foi possível atualizar o favorito.';
      }
    });
  }
}

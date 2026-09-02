import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Prestador, Servico } from '../../../core/models/types';
import { PrestadorService } from '../../../core/services/prestador.service';
import { ServicoService } from '../../../core/services/servico.service';
import { CurrencyPipe, DurationPipe } from '../../../shared/pipes/formatting.pipes';

@Component({
  selector: 'app-perfil-prestador',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DurationPipe],
  template: `
    <section class="profile-page">
      <a class="back-link" routerLink="/prestadores">← Voltar para prestadores</a>

      <p class="loading-state" *ngIf="loading">Carregando perfil...</p>
      <div class="error-state" *ngIf="!loading && errorMessage">
        <h1>Perfil indisponível</h1>
        <p>{{ errorMessage }}</p>
        <a class="btn btn-primary" routerLink="/prestadores">Buscar outros prestadores</a>
      </div>

      <ng-container *ngIf="!loading && prestador">
        <header class="profile-hero">
          <img [src]="prestador.foto || '/assets/placeholder.png'" [alt]="prestador.nomeEstabelecimento">
          <div class="hero-copy">
            <p class="eyebrow">{{ prestador.categoria }}</p>
            <h1>{{ prestador.nomeEstabelecimento }}</h1>
            <p class="description">{{ prestador.descricao }}</p>
            <div class="details">
              <span>📍 {{ prestador.endereco }}</span>
              <span>⏰ {{ prestador.horarioFuncionamento }}</span>
            </div>
          </div>
        </header>

        <section class="services-section">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Escolha seu atendimento</p>
              <h2>Serviços disponíveis</h2>
            </div>
            <span>{{ servicos.length }} opções</span>
          </div>

          <div class="services-list" *ngIf="servicos.length; else noServices">
            <article class="service-row" *ngFor="let servico of servicos">
              <div>
                <h3>{{ servico.nome }}</h3>
                <p>{{ servico.descricao }}</p>
                <span class="duration">⏱ {{ servico.duracaoMinutos | duration }}</span>
              </div>
              <div class="service-action">
                <strong>{{ servico.preco | currency }}</strong>
                <button class="btn btn-primary" (click)="schedule(servico)">Agendar</button>
              </div>
            </article>
          </div>
          <ng-template #noServices>
            <p class="empty-state">Este prestador ainda não cadastrou serviços ativos.</p>
          </ng-template>
        </section>
      </ng-container>
    </section>
  `,
  styles: [`
    .profile-page {
      max-width: 1120px;
      margin: 0 auto;
    }

    .back-link {
      display: inline-block;
      margin-bottom: var(--space-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
    }

    .profile-hero {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: var(--space-2xl);
      align-items: center;
      padding: var(--space-xl);
      margin-bottom: var(--space-2xl);
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }

    .profile-hero img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: var(--radius-md);
      background: var(--color-neutral-200);
    }

    .eyebrow {
      color: var(--color-success-dark);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      margin: 0 0 var(--space-xs);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .hero-copy h1 {
      margin: 0 0 var(--space-md);
    }

    .description {
      color: var(--color-neutral-600);
      max-width: 620px;
    }

    .details {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-lg);
      color: var(--color-neutral-700);
      font-size: var(--font-size-sm);
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

    .section-heading > span {
      color: var(--color-neutral-600);
      font-size: var(--font-size-sm);
    }

    .services-list {
      display: grid;
      gap: var(--space-md);
    }

    .service-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-xl);
      padding: var(--space-lg);
      background: white;
      border: 1px solid var(--color-neutral-200);
      border-radius: var(--radius-lg);
    }

    .service-row h3 {
      margin: 0 0 var(--space-xs);
      font-size: var(--font-size-lg);
    }

    .service-row p {
      margin: 0 0 var(--space-sm);
      color: var(--color-neutral-600);
    }

    .duration {
      color: var(--color-neutral-600);
      font-size: var(--font-size-sm);
    }

    .service-action {
      display: grid;
      justify-items: end;
      gap: var(--space-md);
      min-width: 130px;
    }

    .service-action strong {
      color: var(--color-success-dark);
      font-size: var(--font-size-lg);
    }

    .btn {
      display: inline-block;
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-bold);
      border: 0;
    }

    .loading-state,
    .empty-state,
    .error-state {
      padding: var(--space-3xl) var(--space-lg);
      text-align: center;
    }

    .error-state p {
      color: var(--color-neutral-600);
      margin-bottom: var(--space-lg);
    }

    @media (max-width: 680px) {
      .profile-hero {
        grid-template-columns: 1fr;
        gap: var(--space-lg);
      }

      .profile-hero img {
        max-width: 280px;
      }

      .service-row {
        align-items: start;
        flex-direction: column;
        gap: var(--space-lg);
      }

      .service-action {
        width: 100%;
        justify-items: stretch;
      }
    }
  `]
})
export class PerfilPrestadorComponent implements OnInit {
  prestador?: Prestador;
  servicos: Servico[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prestadorService: PrestadorService,
    private servicoService: ServicoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Prestador não informado.';
      this.loading = false;
      return;
    }

    this.prestadorService.getById(id).subscribe({
      next: prestador => {
        this.prestador = prestador;
        if (!prestador) {
          this.errorMessage = 'Não encontramos esse prestador.';
          this.loading = false;
          return;
        }

        this.servicoService.getByPrestador(prestador.id).subscribe({
          next: servicos => {
            this.servicos = servicos;
            this.loading = false;
          },
          error: () => {
            this.errorMessage = 'Não foi possível carregar os serviços.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar o perfil.';
        this.loading = false;
      }
    });
  }

  schedule(servico: Servico) {
    this.router.navigate(['/agendar', this.prestador?.id], {
      queryParams: { servico: servico.id }
    });
  }
}

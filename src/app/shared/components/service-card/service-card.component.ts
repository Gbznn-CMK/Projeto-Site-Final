import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servico } from '../../../core/models/types';
import { CurrencyPipe, DurationPipe } from '../../pipes/formatting.pipes';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DurationPipe],
  template: `
    <div class="card service-card">
      <div class="card-header">
        <h4 class="service-name">{{ servico.nome }}</h4>
        <span class="service-price">{{ servico.preco | currency }}</span>
      </div>

      <p class="service-description">{{ servico.descricao }}</p>

      <div class="service-meta">
        <span class="meta-item">
          <span class="icon">⏱️</span>
          {{ servico.duracaoMinutos | duration }}
        </span>
      </div>

      <button 
        class="btn btn-primary"
        (click)="onSelect()"
      >
        Agendar {{ servico.nome }}
      </button>
    </div>
  `,
  styles: [`
    .card {
      background-color: white;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-neutral-200);
      overflow: hidden;
      padding: var(--space-lg);
      transition: border-color var(--transition-base), box-shadow var(--transition-base), transform var(--transition-base);
    }

    .card:hover {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: var(--space-md);
      gap: var(--space-md);
    }

    .service-name {
      margin: 0;
      font-size: var(--font-size-lg);
      color: var(--color-neutral-900);
      flex: 1;
    }

    .service-price {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-success-dark);
      white-space: nowrap;
    }

    .service-description {
      color: var(--color-neutral-600);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      margin-bottom: var(--space-md);
    }

    .service-meta {
      display: flex;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-sm);
      color: var(--color-neutral-600);
    }

    .icon {
      font-size: 1rem;
    }

    .btn {
      width: 100%;
      padding: var(--space-md);
      border: none;
      border-radius: var(--radius-md);
      background-color: var(--color-success);
      color: white;
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: background-color var(--transition-base);
    }

    .btn:hover {
      background-color: var(--color-success-dark);
    }
  `]
})
export class ServiceCardComponent {
  @Input() servico!: Servico;
  @Output() selected = new EventEmitter<Servico>();

  onSelect() {
    this.selected.emit(this.servico);
  }
}

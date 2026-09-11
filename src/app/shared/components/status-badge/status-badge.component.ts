import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusAgendamento } from '../../../core/models/types';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="'badge-' + status">
      {{ getLabel() }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: var(--space-xs) var(--space-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-pendente {
      background-color: var(--color-warning-light);
      color: #ff6f00;
    }

    .badge-confirmado {
      background-color: #c8e6c9;
      color: var(--color-success-dark);
    }

    .badge-concluido {
      background-color: #bbdefb;
      color: var(--color-info-dark);
    }

    .badge-cancelado {
      background-color: #ffcdd2;
      color: var(--color-danger-dark);
    }

    .badge-indisponivel {
      background-color: var(--color-neutral-200);
      color: var(--color-neutral-700);
    }

    .badge-aberto {
      background-color: var(--color-warning-light);
      color: #ff6f00;
    }

    .badge-em_andamento {
      background-color: #c8e6c9;
      color: var(--color-success-dark);
    }

    .badge-resolvido {
      background-color: #bbdefb;
      color: var(--color-info-dark);
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: StatusAgendamento | string = 'pendente';
  @Input() customLabel?: string;

  getLabel(): string {
    if (this.customLabel) return this.customLabel;
    
    const labels: Record<string, string> = {
      'pendente': 'Pendente',
      'confirmado': 'Confirmado',
      'concluido': 'Concluído',
      'cancelado': 'Cancelado',
      'indisponivel': 'Indisponível',
      'aberto': 'Aberto',
      'em_andamento': 'Em Andamento',
      'resolvido': 'Resolvido'
    };
    
    return labels[this.status] || this.status;
  }
}

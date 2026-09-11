import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agendamento, Prestador, Servico } from '../../../core/models/types';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { DateTimePipe, CurrencyPipe } from '../../pipes/formatting.pipes';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, DateTimePipe, CurrencyPipe],
  template: `
    <div class="card appointment-card">
      <div class="card-header">
        <div class="appointment-info">
          <h4 class="provider-name">{{ providerName }}</h4>
          <p class="service-name">{{ serviceName }}</p>
        </div>
        <app-status-badge [status]="agendamento.status"></app-status-badge>
      </div>

      <div class="appointment-details">
        <div class="detail-item">
          <span class="icon">📅</span>
          <span>{{ agendamento.dataHora | dateTime: 'date' }}</span>
        </div>
        <div class="detail-item">
          <span class="icon">⏰</span>
          <span>{{ agendamento.dataHora | dateTime: 'time' }}</span>
        </div>
        <div class="detail-item">
          <span class="icon">💰</span>
          <span>{{ agendamento.valor | currency }}</span>
        </div>
        <div class="detail-item" *ngIf="agendamento.notas">
          <span class="icon">📝</span>
          <span>{{ agendamento.notas }}</span>
        </div>
      </div>

      <div class="card-actions">
        <button 
          class="btn btn-secondary"
          (click)="onView()"
        >
          Ver Detalhes
        </button>
        <button 
          class="btn btn-primary"
          *ngIf="isUpcoming"
          (click)="onReschedule()"
        >
          Reagendar
        </button>
        <button 
          class="btn btn-danger"
          *ngIf="isUpcoming"
          (click)="onCancel()"
        >
          Cancelar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: white;
      border-radius: var(--radius-lg);
      border-left: 4px solid var(--color-primary);
      padding: var(--space-lg);
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-base);
    }

    .card:hover {
      box-shadow: var(--shadow-md);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-md);
      gap: var(--space-md);
    }

    .appointment-info {
      flex: 1;
    }

    .provider-name {
      margin: 0 0 var(--space-xs) 0;
      font-size: var(--font-size-lg);
      color: var(--color-neutral-900);
    }

    .service-name {
      margin: 0;
      font-size: var(--font-size-sm);
      color: var(--color-neutral-600);
    }

    .appointment-details {
      margin-bottom: var(--space-lg);
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      font-size: var(--font-size-sm);
      color: var(--color-neutral-700);
      margin-bottom: var(--space-sm);
      padding: var(--space-sm) 0;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .icon {
      font-size: 1rem;
      min-width: 24px;
    }

    .card-actions {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
    }

    .btn {
      flex: 1;
      min-width: 100px;
      padding: var(--space-sm) var(--space-md);
      border: none;
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background-color: var(--color-primary);
      color: white;
    }

    .btn-primary:hover {
      background-color: var(--color-primary-light);
    }

    .btn-secondary {
      background-color: var(--color-neutral-200);
      color: var(--color-neutral-900);
    }

    .btn-secondary:hover {
      background-color: var(--color-neutral-300);
    }

    .btn-danger {
      background-color: var(--color-danger);
      color: white;
    }

    .btn-danger:hover {
      background-color: var(--color-danger-light);
    }
  `]
})
export class AppointmentCardComponent {
  @Input() agendamento!: Agendamento;
  @Input() providerName = 'Prestador';
  @Input() serviceName = 'Serviço';
  @Input() isUpcoming = true;

  @Output() view = new EventEmitter<Agendamento>();
  @Output() reschedule = new EventEmitter<Agendamento>();
  @Output() cancel = new EventEmitter<Agendamento>();

  onView() {
    this.view.emit(this.agendamento);
  }

  onReschedule() {
    this.reschedule.emit(this.agendamento);
  }

  onCancel() {
    this.cancel.emit(this.agendamento);
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agendamento, Prestador, Servico } from '../../../core/models/types';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { DateTimePipe, CurrencyPipe } from '../../pipes/formatting.pipes';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, DateTimePipe, CurrencyPipe],
  templateUrl: './appointment-card.component.html',
  styleUrl: './appointment-card.component.css',
})
export class AppointmentCardComponent {
  @Input() agendamento!: Agendamento;
  @Input() providerName = 'Prestador';
  @Input() serviceName = 'Serviço';
  @Input() isUpcoming = true;

  @Output() view = new EventEmitter<Agendamento>();
  @Output() reschedule = new EventEmitter<Agendamento>();
  @Output() cancel = new EventEmitter<Agendamento>();
  @Output() confirmCompletion = new EventEmitter<Agendamento>();

  onView() {
    this.view.emit(this.agendamento);
  }

  onReschedule() {
    this.reschedule.emit(this.agendamento);
  }

  onCancel() {
    this.cancel.emit(this.agendamento);
  }

  onConfirmCompletion() {
    this.confirmCompletion.emit(this.agendamento);
  }
}

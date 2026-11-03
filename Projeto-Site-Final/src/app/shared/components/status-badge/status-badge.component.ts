import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusAgendamento } from '../../../core/models/types';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css',
})
export class StatusBadgeComponent {
  @Input() status: StatusAgendamento | string = 'pendente';
  @Input() customLabel?: string;

  getLabel(): string {
    if (this.customLabel) return this.customLabel;

    const labels: Record<string, string> = {
      pendente: 'Pendente',
      confirmado: 'Confirmado',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
      indisponivel: 'Indisponível',
      aberto: 'Aberto',
      em_andamento: 'Em Andamento',
      resolvido: 'Resolvido',
    };

    return labels[this.status] || this.status;
  }
}

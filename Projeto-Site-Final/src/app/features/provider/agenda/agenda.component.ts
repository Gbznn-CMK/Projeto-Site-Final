import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agendamento, StatusAgendamento, Usuario } from '../../../core/models/types';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { AuthService } from '../../../core/services/auth.service';
import { PrestadorService } from '../../../core/services/prestador.service';
import { ServicoService } from '../../../core/services/servico.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { DateTimePipe, CurrencyPipe } from '../../../shared/pipes/formatting.pipes';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, DateTimePipe, CurrencyPipe],
  template: `
    <section class="agenda-page">
      <header class="page-heading"><div><p class="eyebrow">Área do prestador</p><h1>Minha agenda</h1><p class="subtitle">Gerencie seus atendimentos e mantenha seus horários em dia.</p></div></header>
      <div class="filters"><button *ngFor="let option of filters" [class.active]="filter === option.value" (click)="setFilter(option.value)">{{ option.label }}</button></div>
      <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>
      <p class="loading-state" *ngIf="loading">Carregando agenda...</p>
      <div class="agenda-list" *ngIf="!loading && filteredAppointments.length">
        <article class="agenda-item" *ngFor="let item of filteredAppointments">
          <div class="date-block"><strong>{{ item.agendamento.dataHora | dateTime:'date' }}</strong><span>{{ item.agendamento.dataHora | dateTime:'time' }}</span></div>
          <div class="appointment-copy"><h2>{{ item.serviceName }}</h2><p>{{ item.clientName }}</p><span>{{ item.agendamento.valor | currency }}</span></div>
          <div class="appointment-actions"><app-status-badge [status]="item.agendamento.status"></app-status-badge><button *ngIf="item.agendamento.status === 'pendente'" class="btn btn-success" (click)="changeStatus(item.agendamento, 'confirmado')">Confirmar</button><button *ngIf="item.agendamento.status === 'confirmado'" class="btn btn-primary" (click)="changeStatus(item.agendamento, 'concluido')">Concluir</button><button *ngIf="item.agendamento.status !== 'cancelado' && item.agendamento.status !== 'concluido'" class="btn btn-danger" (click)="changeStatus(item.agendamento, 'cancelado')">Cancelar</button></div>
        </article>
      </div>
      <div class="empty-state" *ngIf="!loading && !filteredAppointments.length"><h2>Nenhum atendimento encontrado</h2><p>Os agendamentos aparecerão aqui conforme seus clientes reservarem horários.</p></div>
    </section>
  `,
  styles: [`
    .agenda-page { max-width: 1100px; margin: 0 auto; } .page-heading { margin-bottom: var(--space-xl); } .eyebrow { color: var(--color-success-dark); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); margin: 0 0 var(--space-xs); text-transform: uppercase; letter-spacing: 0.08em; } h1 { margin: 0; } .subtitle { color: var(--color-neutral-600); margin: var(--space-xs) 0 0; }
    .filters { display: flex; gap: var(--space-sm); overflow-x: auto; margin-bottom: var(--space-xl); } .filters button { background: white; border: 1px solid var(--color-neutral-300); color: var(--color-neutral-700); white-space: nowrap; } .filters button.active { background: var(--color-primary); border-color: var(--color-primary); color: white; }
    .agenda-list { display: grid; gap: var(--space-md); } .agenda-item { display: grid; grid-template-columns: 150px 1fr auto; align-items: center; gap: var(--space-lg); padding: var(--space-lg); background: white; border: 1px solid var(--color-neutral-200); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
    .date-block { display: grid; gap: var(--space-xs); padding-right: var(--space-lg); border-right: 1px solid var(--color-neutral-200); } .date-block strong { color: var(--color-primary); } .date-block span { color: var(--color-neutral-600); font-size: var(--font-size-lg); }
    .appointment-copy h2 { font-size: var(--font-size-lg); margin: 0 0 var(--space-xs); } .appointment-copy p { color: var(--color-neutral-700); margin: 0 0 var(--space-xs); } .appointment-copy span { color: var(--color-success-dark); font-weight: var(--font-weight-bold); }
    .appointment-actions { display: flex; align-items: center; justify-content: end; gap: var(--space-sm); flex-wrap: wrap; } .btn { padding: var(--space-sm) var(--space-md); color: white; } .btn-success { background: var(--color-success-dark); } .btn-primary { background: var(--color-primary); } .btn-danger { background: var(--color-danger); }
    .loading-state, .empty-state { padding: var(--space-3xl) var(--space-lg); text-align: center; color: var(--color-neutral-600); } .empty-state h2 { color: var(--color-neutral-900); margin-bottom: var(--space-sm); } .empty-state p { margin: 0; } .error-message { padding: var(--space-md); color: var(--color-danger-dark); background: #fff1f0; border-radius: var(--radius-md); }
    @media (max-width: 760px) { .agenda-item { grid-template-columns: 1fr; gap: var(--space-md); } .date-block { border-right: 0; border-bottom: 1px solid var(--color-neutral-200); padding: 0 0 var(--space-md); } .appointment-actions { justify-content: start; } }
  `]
})
export class AgendaComponent implements OnInit {
  appointments: { agendamento: Agendamento; clientName: string; serviceName: string }[] = [];
  filteredAppointments: { agendamento: Agendamento; clientName: string; serviceName: string }[] = [];
  filters = [{ label: 'Todos', value: 'todos' }, { label: 'Pendentes', value: 'pendente' }, { label: 'Confirmados', value: 'confirmado' }, { label: 'Concluídos', value: 'concluido' }, { label: 'Cancelados', value: 'cancelado' }];
  filter = 'todos';
  loading = true;
  errorMessage = '';
  private prestadorId = '';

  constructor(private authService: AuthService, private prestadorService: PrestadorService, private agendamentoService: AgendamentoService, private servicoService: ServicoService, private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (!user) { this.loading = false; return; }
      this.prestadorService.getByUsuarioId(user.id).subscribe(prestador => {
        if (prestador) { this.prestadorId = prestador.id; this.loadAppointments(); } else this.loading = false;
      });
    });
  }

  private loadAppointments() {
    this.agendamentoService.getByPrestador(this.prestadorId).subscribe(appointments => {
      if (!appointments.length) { this.loading = false; return; }
      let loaded = 0;
      appointments.forEach(appointment => {
        this.servicoService.getById(appointment.servicoId).subscribe(service => {
          this.usuarioService.getById(appointment.clienteId).subscribe((client: Usuario | undefined) => {
            this.appointments.push({ agendamento: appointment, serviceName: service?.nome || 'Serviço', clientName: client?.nome || 'Cliente' });
            loaded++;
            if (loaded === appointments.length) { this.appointments.sort((a, b) => new Date(a.agendamento.dataHora).getTime() - new Date(b.agendamento.dataHora).getTime()); this.applyFilter(); this.loading = false; }
          });
        });
      });
    });
  }

  applyFilter() {
    this.filteredAppointments = this.filter === 'todos' ? this.appointments : this.appointments.filter(item => item.agendamento.status === this.filter);
  }

  setFilter(value: string) {
    this.filter = value;
    this.applyFilter();
  }

  changeStatus(appointment: Agendamento, status: StatusAgendamento) {
    this.agendamentoService.updateStatus(appointment.id, status).subscribe({ next: updated => { appointment.status = updated.status; this.applyFilter(); }, error: error => this.errorMessage = error.message || 'Não foi possível atualizar o status.' });
  }
}

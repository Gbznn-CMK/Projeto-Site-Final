import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Agendamento, Prestador, Servico, Usuario } from '../../../core/models/types';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { AuthService } from '../../../core/services/auth.service';
import { PrestadorService } from '../../../core/services/prestador.service';
import { ServicoService } from '../../../core/services/servico.service';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';

@Component({
  selector: 'app-meus-agendamentos',
  standalone: true,
  imports: [CommonModule, RouterLink, AppointmentCardComponent],
  template: `
    <section class="appointments-page">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Sua agenda</p>
          <h1>Meus agendamentos</h1>
          <p class="subtitle">Acompanhe seus próximos atendimentos em um só lugar.</p>
        </div>
        <a class="btn btn-primary" routerLink="/prestadores">Novo agendamento</a>
      </div>

      <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>
      <p class="loading-state" *ngIf="loading">Carregando agendamentos...</p>

      <div class="appointments-list" *ngIf="!loading && appointments.length">
        <app-appointment-card
          *ngFor="let item of appointments"
          [agendamento]="item.agendamento"
          [providerName]="item.providerName"
          [serviceName]="item.serviceName"
          [isUpcoming]="isUpcoming(item.agendamento)"
          (cancel)="cancelAppointment($event)"
        ></app-appointment-card>
      </div>

      <div class="empty-state" *ngIf="!loading && !appointments.length">
        <h2>Você ainda não tem agendamentos</h2>
        <p>Encontre um prestador e reserve seu primeiro horário.</p>
        <a class="btn btn-success" routerLink="/prestadores">Buscar prestadores</a>
      </div>
    </section>
  `,
  styles: [`
    .appointments-page { max-width: 1000px; margin: 0 auto; }
    .page-heading { display: flex; align-items: end; justify-content: space-between; gap: var(--space-lg); margin-bottom: var(--space-2xl); }
    .eyebrow { color: var(--color-success-dark); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); margin: 0 0 var(--space-xs); text-transform: uppercase; letter-spacing: 0.08em; }
    h1 { margin: 0 0 var(--space-xs); }
    .subtitle { color: var(--color-neutral-600); margin: 0; }
    .btn { display: inline-block; padding: var(--space-md) var(--space-lg); border-radius: var(--radius-md); font-weight: var(--font-weight-bold); white-space: nowrap; }
    .appointments-list { display: grid; gap: var(--space-lg); }
    .loading-state, .empty-state { padding: var(--space-3xl) var(--space-lg); text-align: center; color: var(--color-neutral-600); }
    .empty-state h2 { color: var(--color-neutral-900); margin-bottom: var(--space-sm); }
    .empty-state p { margin-bottom: var(--space-lg); }
    .error-message { padding: var(--space-md); color: var(--color-danger-dark); background: #fff1f0; border-radius: var(--radius-md); margin-bottom: var(--space-lg); }
    @media (max-width: 640px) { .page-heading { align-items: start; flex-direction: column; } .page-heading .btn { width: 100%; text-align: center; } }
  `]
})
export class MeusAgendamentosComponent implements OnInit {
  appointments: { agendamento: Agendamento; providerName: string; serviceName: string }[] = [];
  currentUser?: Usuario;
  loading = true;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private agendamentoService: AgendamentoService,
    private prestadorService: PrestadorService,
    private servicoService: ServicoService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user || undefined;
      if (this.currentUser) this.loadAppointments(this.currentUser.id);
    });
  }

  private loadAppointments(clienteId: string) {
    this.agendamentoService.getByCliente(clienteId).subscribe({
      next: agendamentos => {
        if (!agendamentos.length) {
          this.loading = false;
          return;
        }

        let loaded = 0;
        agendamentos.forEach(agendamento => {
          let providerName = 'Prestador';
          let serviceName = 'Serviço';
          this.prestadorService.getById(agendamento.prestadorId).subscribe(prestador => {
            providerName = prestador?.nomeEstabelecimento || providerName;
            this.servicoService.getById(agendamento.servicoId).subscribe(servico => {
              serviceName = servico?.nome || serviceName;
              this.appointments.push({ agendamento, providerName, serviceName });
              loaded++;
              if (loaded === agendamentos.length) this.finishLoading();
            });
          });
        });
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar seus agendamentos.';
        this.finishLoading();
      }
    });
  }

  isUpcoming(agendamento: Agendamento): boolean {
    return agendamento.status !== 'cancelado' && new Date(agendamento.dataHora).getTime() > Date.now();
  }

  cancelAppointment(agendamento: Agendamento) {
    if (!this.currentUser || !confirm('Deseja cancelar este agendamento?')) return;

    this.agendamentoService.cancel(agendamento.id, this.currentUser.id).subscribe({
      next: () => {
        agendamento.status = 'cancelado';
      },
      error: error => {
        this.errorMessage = error.message || 'Não foi possível cancelar o agendamento.';
      }
    });
  }

  private finishLoading() {
    this.appointments.sort((first, second) =>
      new Date(first.agendamento.dataHora).getTime() - new Date(second.agendamento.dataHora).getTime()
    );
    this.loading = false;
  }
}

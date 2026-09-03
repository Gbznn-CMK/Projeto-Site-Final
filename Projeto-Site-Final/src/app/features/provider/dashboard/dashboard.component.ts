import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Agendamento, Prestador, Servico, Usuario } from '../../../core/models/types';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { AuthService } from '../../../core/services/auth.service';
import { PrestadorService } from '../../../core/services/prestador.service';
import { ServicoService } from '../../../core/services/servico.service';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, DecimalPipe, RouterLink, AppointmentCardComponent],
  template: `
    <section class="dashboard-page">
      <header class="page-heading">
        <div><p class="eyebrow">Área do prestador</p><h1>{{ prestador?.nomeEstabelecimento || 'Meu painel' }}</h1><p class="subtitle">Acompanhe o movimento do seu negócio.</p></div>
        <a class="btn btn-primary" routerLink="/minha-agenda">Ver agenda</a>
      </header>

      <p class="loading-state" *ngIf="loading">Carregando painel...</p>
      <ng-container *ngIf="!loading">
        <div class="metrics">
          <article><span>Agendamentos ativos</span><strong>{{ activeAppointments }}</strong></article>
          <article><span>Aguardando confirmação</span><strong>{{ pendingAppointments }}</strong></article>
          <article><span>Serviços cadastrados</span><strong>{{ servicesCount }}</strong></article>
          <article><span>Receita prevista</span><strong>{{ projectedRevenue | number:'1.2-2' }}</strong></article>
        </div>

        <section class="upcoming-section">
          <div class="section-heading"><div><p class="eyebrow">Próximos horários</p><h2>Agenda de hoje e amanhã</h2></div><a routerLink="/minha-agenda">Abrir agenda</a></div>
          <div class="appointments-list" *ngIf="upcoming.length; else emptyAgenda">
            <app-appointment-card *ngFor="let item of upcoming" [agendamento]="item.agendamento" [providerName]="item.clientName" [serviceName]="item.serviceName" [isUpcoming]="false"></app-appointment-card>
          </div>
          <ng-template #emptyAgenda><div class="empty-state"><h3>Nenhum atendimento próximo</h3><p>Novos agendamentos aparecerão aqui.</p></div></ng-template>
        </section>
      </ng-container>
    </section>
  `,
  styles: [`
    .dashboard-page { max-width: 1280px; margin: 0 auto; }
    .page-heading, .section-heading { display: flex; align-items: end; justify-content: space-between; gap: var(--space-lg); }
    .page-heading { margin-bottom: var(--space-2xl); } .section-heading { margin-bottom: var(--space-lg); }
    .eyebrow { color: var(--color-success-dark); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); margin: 0 0 var(--space-xs); text-transform: uppercase; letter-spacing: 0.08em; }
    h1, h2 { margin: 0; } .subtitle { color: var(--color-neutral-600); margin: var(--space-xs) 0 0; }
    .btn { display: inline-block; padding: var(--space-md) var(--space-lg); border-radius: var(--radius-md); font-weight: var(--font-weight-bold); white-space: nowrap; }
    .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-md); margin-bottom: var(--space-2xl); }
    .metrics article { display: grid; gap: var(--space-md); padding: var(--space-lg); background: white; border: 1px solid var(--color-neutral-200); border-radius: var(--radius-lg); }
    .metrics span { color: var(--color-neutral-600); font-size: var(--font-size-sm); } .metrics strong { color: var(--color-primary); font-size: var(--font-size-2xl); }
    .appointments-list { display: grid; gap: var(--space-md); } .empty-state, .loading-state { padding: var(--space-2xl); text-align: center; color: var(--color-neutral-600); background: white; border-radius: var(--radius-lg); }
    .empty-state h3 { color: var(--color-neutral-900); margin-bottom: var(--space-xs); } .empty-state p { margin: 0; }
    @media (max-width: 800px) { .metrics { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .page-heading, .section-heading { align-items: start; flex-direction: column; } .metrics { grid-template-columns: 1fr; } .page-heading .btn { width: 100%; text-align: center; } }
  `]
})
export class DashboardComponent implements OnInit {
  prestador?: Prestador;
  upcoming: { agendamento: Agendamento; clientName: string; serviceName: string }[] = [];
  activeAppointments = 0;
  pendingAppointments = 0;
  servicesCount = 0;
  projectedRevenue = 0;
  loading = true;

  constructor(
    private authService: AuthService,
    private prestadorService: PrestadorService,
    private agendamentoService: AgendamentoService,
    private servicoService: ServicoService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) this.loadDashboard(user);
    });
  }

  private loadDashboard(user: Usuario) {
    this.prestadorService.getByUsuarioId(user.id).subscribe(prestador => {
      if (!prestador) { this.loading = false; return; }
      this.prestador = prestador;
      this.servicoService.getByPrestador(prestador.id).subscribe(services => {
        this.servicesCount = services.length;
        this.agendamentoService.getByPrestador(prestador.id).subscribe(appointments => {
          const active = appointments.filter(appointment => appointment.status !== 'cancelado' && new Date(appointment.dataHora) >= new Date());
          this.activeAppointments = active.length;
          this.pendingAppointments = active.filter(appointment => appointment.status === 'pendente').length;
          this.projectedRevenue = active.reduce((total, appointment) => total + appointment.valor, 0);
          this.upcoming = active.slice(0, 3).map(appointment => ({
            agendamento: appointment,
            clientName: `Cliente ${appointment.clienteId}`,
            serviceName: services.find(service => service.id === appointment.servicoId)?.nome || 'Serviço'
          }));
          this.loading = false;
        });
      });
    });
  }
}

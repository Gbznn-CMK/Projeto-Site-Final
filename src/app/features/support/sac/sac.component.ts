import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChamadoSac, StatusChamado, Usuario } from '../../../core/models/types';
import { AuthService } from '../../../core/services/auth.service';
import { SacService } from '../../../core/services/sac.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { DateTimePipe } from '../../../shared/pipes/formatting.pipes';

@Component({
  selector: 'app-sac',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, DateTimePipe],
  template: `
    <section class="support-page">
      <header class="page-heading"><div><p class="eyebrow">Ajuda</p><h1>SAC e suporte</h1><p class="subtitle">Fale com nossa equipe e acompanhe suas solicitações.</p></div><button class="btn btn-primary" (click)="showForm = !showForm">{{ showForm ? 'Fechar formulário' : 'Abrir chamado' }}</button></header>
      <form class="ticket-form" *ngIf="showForm" (ngSubmit)="createTicket()" #ticketForm="ngForm"><h2>Novo chamado</h2><label class="field"><span>Assunto</span><input name="subject" [(ngModel)]="subject" required placeholder="Sobre o que você precisa de ajuda?"></label><label class="field"><span>Mensagem</span><textarea name="message" [(ngModel)]="message" rows="5" required placeholder="Descreva o que aconteceu"></textarea></label><div class="form-actions"><button type="button" class="btn btn-secondary" (click)="showForm = false">Cancelar</button><button class="btn btn-success" type="submit" [disabled]="ticketForm.invalid || saving">{{ saving ? 'Enviando...' : 'Enviar chamado' }}</button></div></form>
      <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p><p class="success-message" *ngIf="successMessage">{{ successMessage }}</p><p class="loading-state" *ngIf="loading">Carregando chamados...</p>
      <ng-container *ngIf="!loading"><div class="filters"><button *ngFor="let option of filters" [class.active]="filter === option.value" (click)="setFilter(option.value)">{{ option.label }}</button></div><div class="tickets-list" *ngIf="filteredTickets.length; else emptyTickets"><article class="ticket" *ngFor="let ticket of filteredTickets"><div class="ticket-header"><div><h2>{{ ticket.assunto }}</h2><span>{{ ticket.dataCadastro || '' | dateTime:'datetime' }}</span></div><app-status-badge [status]="ticket.status"></app-status-badge></div><p class="ticket-message">{{ ticket.mensagem }}</p><div class="response" *ngIf="ticket.resposta"><strong>Resposta da equipe</strong><p>{{ ticket.resposta }}</p></div></article></div><ng-template #emptyTickets><div class="empty-state"><h2>Nenhum chamado encontrado</h2><p>Quando precisar de ajuda, abra um chamado e acompanhe a resposta por aqui.</p><button class="btn btn-success" (click)="showForm = true">Abrir primeiro chamado</button></div></ng-template></ng-container>
    </section>
  `,
  styles: [`
    .support-page { max-width: 1000px; margin: 0 auto; } .page-heading { display: flex; align-items: end; justify-content: space-between; gap: var(--space-lg); margin-bottom: var(--space-xl); } .eyebrow { color: var(--color-success-dark); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); margin: 0 0 var(--space-xs); text-transform: uppercase; letter-spacing: 0.08em; } h1, h2 { margin: 0; } .subtitle { color: var(--color-neutral-600); margin: var(--space-xs) 0 0; }
    .btn { padding: var(--space-sm) var(--space-md); } .btn-primary { color: white; background: var(--color-primary); } .btn-success { color: white; background: var(--color-success-dark); } .btn-secondary { color: var(--color-neutral-900); background: var(--color-neutral-200); } .ticket-form { display: grid; gap: var(--space-lg); padding: var(--space-xl); margin-bottom: var(--space-xl); background: white; border: 1px solid var(--color-neutral-200); border-radius: var(--radius-lg); } .ticket-form h2 { font-size: var(--font-size-xl); } .field { display: grid; gap: var(--space-xs); } .field span { color: var(--color-neutral-700); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); } .form-actions { display: flex; justify-content: end; gap: var(--space-md); }
    .filters { display: flex; gap: var(--space-sm); overflow-x: auto; margin-bottom: var(--space-lg); } .filters button { color: var(--color-neutral-700); background: white; border: 1px solid var(--color-neutral-300); white-space: nowrap; } .filters button.active { color: white; background: var(--color-primary); border-color: var(--color-primary); } .tickets-list { display: grid; gap: var(--space-md); } .ticket { padding: var(--space-lg); background: white; border: 1px solid var(--color-neutral-200); border-radius: var(--radius-lg); } .ticket-header { display: flex; align-items: start; justify-content: space-between; gap: var(--space-lg); margin-bottom: var(--space-md); } .ticket-header h2 { font-size: var(--font-size-lg); margin-bottom: var(--space-xs); } .ticket-header span { color: var(--color-neutral-500); font-size: var(--font-size-xs); } .ticket-message { color: var(--color-neutral-700); white-space: pre-wrap; } .response { padding: var(--space-md); background: var(--color-neutral-50); border-left: 3px solid var(--color-success); } .response p { margin: var(--space-xs) 0 0; color: var(--color-neutral-700); } .error-message, .success-message { padding: var(--space-md); border-radius: var(--radius-md); margin-bottom: var(--space-lg); } .error-message { color: var(--color-danger-dark); background: #fff1f0; } .success-message { color: var(--color-success-dark); background: #e8f5e9; } .loading-state, .empty-state { padding: var(--space-3xl) var(--space-lg); text-align: center; color: var(--color-neutral-600); } .empty-state h2 { color: var(--color-neutral-900); margin-bottom: var(--space-sm); } .empty-state p { margin-bottom: var(--space-lg); }
    @media (max-width: 640px) { .page-heading { align-items: start; flex-direction: column; } .page-heading .btn { width: 100%; } .ticket-header { align-items: start; flex-direction: column; } .form-actions { flex-direction: column-reverse; } .form-actions .btn { width: 100%; } }
  `]
})
export class SacComponent implements OnInit {
  tickets: ChamadoSac[] = [];
  filteredTickets: ChamadoSac[] = [];
  filters = [{ label: 'Todos', value: 'todos' }, { label: 'Abertos', value: 'aberto' }, { label: 'Em andamento', value: 'em_andamento' }, { label: 'Resolvidos', value: 'resolvido' }];
  filter = 'todos'; subject = ''; message = ''; showForm = false; loading = true; saving = false; errorMessage = ''; successMessage = ''; private userId = '';

  constructor(private authService: AuthService, private sacService: SacService) {}

  ngOnInit() { this.authService.getCurrentUser().subscribe((user: Usuario | null) => { if (user) { this.userId = user.id; this.loadTickets(); } else this.loading = false; }); }
  private loadTickets() { this.sacService.getChamados(this.userId).subscribe({ next: tickets => { this.tickets = tickets.sort((a, b) => new Date(b.dataCadastro || '').getTime() - new Date(a.dataCadastro || '').getTime()); this.applyFilter(); this.loading = false; }, error: () => { this.errorMessage = 'Não foi possível carregar os chamados.'; this.loading = false; } }); }
  setFilter(value: string) { this.filter = value; this.applyFilter(); }
  private applyFilter() { this.filteredTickets = this.filter === 'todos' ? this.tickets : this.tickets.filter(ticket => ticket.status === this.filter); }
  createTicket() { if (!this.subject.trim() || !this.message.trim() || !this.userId) return; this.saving = true; this.sacService.criarChamado(this.userId, this.subject.trim(), this.message.trim()).subscribe({ next: ticket => { this.tickets = [ticket, ...this.tickets]; this.applyFilter(); this.subject = ''; this.message = ''; this.showForm = false; this.successMessage = 'Chamado enviado com sucesso.'; this.saving = false; }, error: () => { this.errorMessage = 'Não foi possível enviar o chamado.'; this.saving = false; } }); }
}

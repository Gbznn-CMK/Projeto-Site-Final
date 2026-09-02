import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Servico, Usuario } from '../../../core/models/types';
import { AuthService } from '../../../core/services/auth.service';
import { PrestadorService } from '../../../core/services/prestador.service';
import { ServicoService } from '../../../core/services/servico.service';
import { CurrencyPipe, DurationPipe } from '../../../shared/pipes/formatting.pipes';

@Component({
  selector: 'app-meus-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DurationPipe],
  template: `
    <section class="services-page">
      <header class="page-heading"><div><p class="eyebrow">Área do prestador</p><h1>Meus serviços</h1><p class="subtitle">Mantenha seu catálogo atualizado para seus clientes.</p></div><button class="btn btn-primary" (click)="openForm()">Novo serviço</button></header>
      <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>
      <p class="success-message" *ngIf="successMessage">{{ successMessage }}</p>
      <form class="service-form" *ngIf="showForm" (ngSubmit)="saveService()" #serviceForm="ngForm">
        <h2>{{ editingService ? 'Editar serviço' : 'Novo serviço' }}</h2>
        <label class="field"><span>Nome</span><input name="nome" [(ngModel)]="draft.nome" required></label>
        <label class="field"><span>Descrição</span><textarea name="descricao" [(ngModel)]="draft.descricao" rows="3" required></textarea></label>
        <div class="form-grid"><label class="field"><span>Duração (minutos)</span><input type="number" name="duracao" [(ngModel)]="draft.duracaoMinutos" min="15" step="15" required></label><label class="field"><span>Preço</span><input type="number" name="preco" [(ngModel)]="draft.preco" min="0" step="0.01" required></label></div>
        <div class="form-actions"><button type="button" class="btn btn-secondary" (click)="closeForm()">Cancelar</button><button type="submit" class="btn btn-success" [disabled]="serviceForm.invalid || saving">{{ saving ? 'Salvando...' : 'Salvar serviço' }}</button></div>
      </form>
      <p class="loading-state" *ngIf="loading">Carregando serviços...</p>
      <div class="services-list" *ngIf="!loading && services.length"><article class="service-item" *ngFor="let service of services" [class.inactive]="!service.ativo"><div class="service-copy"><div class="service-title"><h2>{{ service.nome }}</h2><span [class.active-status]="service.ativo">{{ service.ativo ? 'Ativo' : 'Inativo' }}</span></div><p>{{ service.descricao }}</p><span class="meta">{{ service.duracaoMinutos | duration }} · {{ service.preco | currency }}</span></div><div class="service-actions"><button class="btn btn-secondary" (click)="editService(service)">{{ service.ativo ? 'Editar' : 'Editar' }}</button><button class="btn btn-primary" (click)="toggleService(service)">{{ service.ativo ? 'Desativar' : 'Ativar' }}</button><button class="btn btn-danger" (click)="deleteService(service)">Excluir</button></div></article></div>
      <div class="empty-state" *ngIf="!loading && !services.length"><h2>Seu catálogo está vazio</h2><p>Cadastre seu primeiro serviço para começar a receber agendamentos.</p><button class="btn btn-success" (click)="openForm()">Cadastrar serviço</button></div>
    </section>
  `,
  styles: [`
    .services-page { max-width: 1100px; margin: 0 auto; } .page-heading { display: flex; align-items: end; justify-content: space-between; gap: var(--space-lg); margin-bottom: var(--space-xl); } .eyebrow { color: var(--color-success-dark); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); margin: 0 0 var(--space-xs); text-transform: uppercase; letter-spacing: 0.08em; } h1, h2 { margin: 0; } .subtitle { color: var(--color-neutral-600); margin: var(--space-xs) 0 0; }
    .btn { padding: var(--space-sm) var(--space-md); } .service-form { display: grid; gap: var(--space-lg); padding: var(--space-xl); margin-bottom: var(--space-xl); background: white; border: 1px solid var(--color-neutral-200); border-radius: var(--radius-lg); } .service-form h2 { font-size: var(--font-size-xl); } .field { display: grid; gap: var(--space-xs); } .field span { color: var(--color-neutral-700); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); } .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); } .form-actions { display: flex; justify-content: end; gap: var(--space-md); }
    .services-list { display: grid; gap: var(--space-md); } .service-item { display: flex; justify-content: space-between; gap: var(--space-xl); padding: var(--space-lg); background: white; border: 1px solid var(--color-neutral-200); border-radius: var(--radius-lg); } .service-item.inactive { opacity: 0.65; } .service-title { display: flex; align-items: center; gap: var(--space-md); } .service-title h2 { font-size: var(--font-size-lg); } .service-title span { padding: var(--space-xs) var(--space-sm); color: var(--color-neutral-600); background: var(--color-neutral-200); border-radius: var(--radius-full); font-size: var(--font-size-xs); } .service-title span.active-status { color: var(--color-success-dark); background: #e8f5e9; } .service-copy p { color: var(--color-neutral-600); margin: var(--space-sm) 0; } .meta { color: var(--color-primary); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); } .service-actions { display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap; justify-content: end; } .btn-primary { color: white; background: var(--color-primary); } .btn-success { color: white; background: var(--color-success-dark); } .btn-danger { color: white; background: var(--color-danger); } .btn-secondary { color: var(--color-neutral-900); background: var(--color-neutral-200); }
    .error-message, .success-message { padding: var(--space-md); border-radius: var(--radius-md); margin-bottom: var(--space-lg); } .error-message { color: var(--color-danger-dark); background: #fff1f0; } .success-message { color: var(--color-success-dark); background: #e8f5e9; } .loading-state, .empty-state { padding: var(--space-3xl) var(--space-lg); text-align: center; color: var(--color-neutral-600); } .empty-state h2 { color: var(--color-neutral-900); margin-bottom: var(--space-sm); } .empty-state p { margin-bottom: var(--space-lg); }
    @media (max-width: 700px) { .page-heading, .service-item { align-items: start; flex-direction: column; } .page-heading .btn { width: 100%; } .service-actions { justify-content: start; } } @media (max-width: 480px) { .form-grid { grid-template-columns: 1fr; } .form-actions { flex-direction: column-reverse; } .form-actions .btn { width: 100%; } }
  `]
})
export class MeusServicosComponent implements OnInit {
  services: Servico[] = [];
  draft: Partial<Servico> = { nome: '', descricao: '', duracaoMinutos: 30, preco: 0, ativo: true };
  editingService?: Servico;
  showForm = false;
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  private prestadorId = '';

  constructor(private authService: AuthService, private prestadorService: PrestadorService, private servicoService: ServicoService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: Usuario | null) => {
      if (!user) { this.loading = false; return; }
      this.prestadorService.getByUsuarioId(user.id).subscribe(prestador => { if (prestador) { this.prestadorId = prestador.id; this.loadServices(); } else this.loading = false; });
    });
  }

  private loadServices() { this.servicoService.getAllByPrestador(this.prestadorId).subscribe({ next: services => { this.services = services; this.loading = false; }, error: () => { this.errorMessage = 'Não foi possível carregar os serviços.'; this.loading = false; } }); }
  openForm() { this.editingService = undefined; this.draft = { nome: '', descricao: '', duracaoMinutos: 30, preco: 0, ativo: true }; this.showForm = true; this.successMessage = ''; }
  closeForm() { this.showForm = false; this.editingService = undefined; }
  editService(service: Servico) { this.editingService = service; this.draft = { ...service }; this.showForm = true; this.successMessage = ''; }
  saveService() {
    if (!this.draft.nome || !this.draft.descricao || !this.draft.duracaoMinutos || this.draft.preco === undefined || !this.prestadorId) return;
    this.saving = true; this.errorMessage = '';
    const service = { ...this.draft, prestadorId: this.prestadorId, nome: this.draft.nome.trim(), descricao: this.draft.descricao.trim(), duracaoMinutos: Number(this.draft.duracaoMinutos), preco: Number(this.draft.preco), ativo: this.draft.ativo ?? true } as Servico;
    const request = this.editingService ? this.servicoService.update(service) : this.servicoService.create(service);
    request.subscribe({ next: saved => { if (this.editingService) this.services = this.services.map(item => item.id === saved.id ? saved : item); else this.services = [...this.services, saved]; this.successMessage = 'Serviço salvo com sucesso.'; this.saving = false; this.closeForm(); }, error: error => { this.errorMessage = error.message || 'Não foi possível salvar o serviço.'; this.saving = false; } });
  }
  toggleService(service: Servico) { this.servicoService.update({ ...service, ativo: !service.ativo }).subscribe({ next: updated => { this.services = this.services.map(item => item.id === updated.id ? updated : item); }, error: () => this.errorMessage = 'Não foi possível alterar o status do serviço.' }); }
  deleteService(service: Servico) { if (!confirm(`Excluir o serviço ${service.nome}?`)) return; this.servicoService.delete(service.id).subscribe({ next: () => { this.services = this.services.filter(item => item.id !== service.id); this.successMessage = 'Serviço excluído.'; }, error: error => this.errorMessage = error.message || 'Não foi possível excluir o serviço.' }); }
}

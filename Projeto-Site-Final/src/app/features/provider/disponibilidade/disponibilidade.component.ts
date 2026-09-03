import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Disponibilidade, Bloqueio, Usuario } from '../../../core/models/types';
import { AuthService } from '../../../core/services/auth.service';
import { DisponibilidadeService } from '../../../core/services/disponibilidade.service';
import { PrestadorService } from '../../../core/services/prestador.service';
import { toLocalDateKey } from '../../../shared/utils/time.utils';

@Component({
  selector: 'app-disponibilidade',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, FormsModule],
  template: `
    <section class="availability-page">
      <header class="page-heading"><div><p class="eyebrow">Área do prestador</p><h1>Disponibilidade</h1><p class="subtitle">Defina quando seus clientes podem reservar um horário.</p></div></header>
      <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p><p class="success-message" *ngIf="successMessage">{{ successMessage }}</p><p class="loading-state" *ngIf="loading">Carregando disponibilidade...</p>
      <ng-container *ngIf="!loading">
        <section class="schedule-card"><div class="section-heading"><div><h2>Horários semanais</h2><p>Use intervalos de 30 minutos para manter sua agenda organizada.</p></div><button class="btn btn-success" (click)="saveSchedule()" [disabled]="saving">{{ saving ? 'Salvando...' : 'Salvar horários' }}</button></div>
          <div class="schedule-list"><article class="day-row" *ngFor="let day of schedule"><div class="day-name"><label><input type="checkbox" [(ngModel)]="day.ativo" [name]="'active-' + day.diaSemana"> <strong>{{ dayNames[day.diaSemana] }}</strong></label></div><div class="time-fields" [class.disabled]="!day.ativo"><label><span>De</span><input type="time" [(ngModel)]="day.horaInicio" [name]="'start-' + day.diaSemana" [disabled]="!day.ativo"></label><label><span>Até</span><input type="time" [(ngModel)]="day.horaFim" [name]="'end-' + day.diaSemana" [disabled]="!day.ativo"></label></div></article></div>
        </section>
        <section class="schedule-card blocks-card"><div class="section-heading"><div><h2>Bloquear horário</h2><p>Reserve um período para folgas, compromissos ou manutenção.</p></div></div><form class="block-form" (ngSubmit)="blockTime()"><label><span>Data</span><input type="date" [(ngModel)]="blockDate" name="blockDate" [min]="minimumDate" required></label><label><span>Horário</span><input type="time" [(ngModel)]="blockHour" name="blockHour" required></label><label><span>Duração</span><select [(ngModel)]="blockDuration" name="blockDuration"><option [ngValue]="30">30 minutos</option><option [ngValue]="60">1 hora</option><option [ngValue]="120">2 horas</option><option [ngValue]="480">Dia inteiro</option></select></label><label><span>Motivo (opcional)</span><input type="text" [(ngModel)]="blockReason" name="blockReason" placeholder="Ex.: compromisso"></label><button class="btn btn-primary" type="submit" [disabled]="blocking">{{ blocking ? 'Bloqueando...' : 'Bloquear horário' }}</button></form>
          <div class="blocks-list" *ngIf="blocks.length"><article *ngFor="let block of blocks"><div><strong>{{ block.dataHora | date:'dd/MM/yyyy HH:mm' }}</strong><span>{{ block.duracao }} minutos<span *ngIf="block.motivo"> · {{ block.motivo }}</span></span></div><button class="btn btn-danger" (click)="unblock(block)">Remover</button></article></div>
        </section>
      </ng-container>
    </section>
  `,
  styles: [`
    .availability-page { max-width: 1000px; margin: 0 auto; } .page-heading { margin-bottom: var(--space-xl); } .eyebrow { color: var(--color-success-dark); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); margin: 0 0 var(--space-xs); text-transform: uppercase; letter-spacing: 0.08em; } h1, h2 { margin: 0; } .subtitle, .section-heading p { color: var(--color-neutral-600); margin: var(--space-xs) 0 0; }
    .schedule-card { padding: var(--space-xl); margin-bottom: var(--space-xl); background: white; border: 1px solid var(--color-neutral-200); border-radius: var(--radius-lg); } .section-heading { display: flex; align-items: end; justify-content: space-between; gap: var(--space-lg); margin-bottom: var(--space-lg); } .schedule-list { display: grid; border-top: 1px solid var(--color-neutral-200); } .day-row { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: var(--space-lg); padding: var(--space-md) 0; border-bottom: 1px solid var(--color-neutral-200); } .day-name label { display: flex; align-items: center; gap: var(--space-sm); } .time-fields { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); } .time-fields.disabled { opacity: 0.45; } label { display: grid; gap: var(--space-xs); } label span { color: var(--color-neutral-700); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); } .btn { padding: var(--space-sm) var(--space-md); color: white; } .btn-success { background: var(--color-success-dark); } .btn-primary { background: var(--color-primary); } .btn-danger { background: var(--color-danger); }
    .block-form { display: grid; grid-template-columns: 1fr 1fr 1fr 1.5fr auto; align-items: end; gap: var(--space-md); } .blocks-list { display: grid; gap: var(--space-sm); margin-top: var(--space-xl); } .blocks-list article { display: flex; align-items: center; justify-content: space-between; gap: var(--space-lg); padding: var(--space-md); background: var(--color-neutral-50); border-radius: var(--radius-md); } .blocks-list article div { display: grid; gap: var(--space-xs); } .blocks-list article span { color: var(--color-neutral-600); font-size: var(--font-size-sm); }
    .error-message, .success-message { padding: var(--space-md); border-radius: var(--radius-md); margin-bottom: var(--space-lg); } .error-message { color: var(--color-danger-dark); background: #fff1f0; } .success-message { color: var(--color-success-dark); background: #e8f5e9; } .loading-state { padding: var(--space-3xl); text-align: center; color: var(--color-neutral-600); }
    @media (max-width: 850px) { .block-form { grid-template-columns: 1fr 1fr; } .block-form button { grid-column: span 2; } } @media (max-width: 600px) { .schedule-card { padding: var(--space-lg); } .section-heading { align-items: start; flex-direction: column; } .section-heading .btn { width: 100%; } .day-row { grid-template-columns: 1fr; gap: var(--space-md); } .block-form { grid-template-columns: 1fr; } .block-form button { grid-column: auto; } .blocks-list article { align-items: start; flex-direction: column; } }
  `]
})
export class DisponibilidadeComponent implements OnInit {
  dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  schedule: Disponibilidade[] = [];
  blocks: Bloqueio[] = [];
  loading = true; saving = false; blocking = false; errorMessage = ''; successMessage = '';
  blockDate = ''; blockHour = ''; blockDuration = 60; blockReason = ''; minimumDate = toLocalDateKey(new Date());
  private readonly destroyRef = inject(DestroyRef);
  private prestadorId = '';

  constructor(private authService: AuthService, private prestadorService: PrestadorService, private availabilityService: DisponibilidadeService) {}

  ngOnInit() {
    this.authService.getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: Usuario | null) => {
      if (!user) { this.loading = false; return; }
      this.prestadorService.getByUsuarioId(user.id).subscribe(prestador => { if (prestador) { this.prestadorId = prestador.id; this.loadData(); } else this.loading = false; });
    });
  }

  private loadData() {
    this.availabilityService.getDisponibilidadesForPrestador(this.prestadorId).subscribe(schedule => { this.schedule = this.dayNames.map((_, index) => schedule.find(day => day.diaSemana === index) || { id: `disp-${index}`, prestadorId: this.prestadorId, diaSemana: index, horaInicio: '09:00', horaFim: '18:00', ativo: false }); this.availabilityService.getBloqueios(this.prestadorId).subscribe(blocks => { this.blocks = blocks; this.loading = false; }); });
  }

  saveSchedule() { this.saving = true; this.errorMessage = ''; this.availabilityService.updateDisponibilidades(this.prestadorId, this.schedule).subscribe({ next: () => { this.successMessage = 'Horários salvos com sucesso.'; this.saving = false; }, error: () => { this.errorMessage = 'Não foi possível salvar os horários.'; this.saving = false; } }); }
  blockTime() { if (!this.blockDate || !this.blockHour) return; this.blocking = true; this.errorMessage = ''; this.availabilityService.blockTime(this.prestadorId, `${this.blockDate}T${this.blockHour}:00`, this.blockDuration, this.blockReason.trim() || undefined).subscribe({ next: block => { this.blocks = [...this.blocks, block]; this.blockDate = ''; this.blockHour = ''; this.blockReason = ''; this.successMessage = 'Horário bloqueado.'; this.blocking = false; }, error: () => { this.errorMessage = 'Não foi possível bloquear o horário.'; this.blocking = false; } }); }
  unblock(block: Bloqueio) { if (!confirm('Remover este bloqueio?')) return; this.availabilityService.unblockTime(block.id).subscribe({ next: () => { this.blocks = this.blocks.filter(item => item.id !== block.id); this.successMessage = 'Bloqueio removido.'; }, error: () => this.errorMessage = 'Não foi possível remover o bloqueio.' }); }
}

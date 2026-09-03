import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Agendamento, MetodoPagamento, Prestador, Servico, TimeSlot, Usuario } from '../../../core/models/types';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { AuthService } from '../../../core/services/auth.service';
import { DisponibilidadeService } from '../../../core/services/disponibilidade.service';
import { PrestadorService } from '../../../core/services/prestador.service';
import { ServicoService } from '../../../core/services/servico.service';
import { CurrencyPipe, DurationPipe } from '../../../shared/pipes/formatting.pipes';
import { toLocalDateKey } from '../../../shared/utils/time.utils';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, FormsModule, RouterLink, CurrencyPipe, DurationPipe],
  template: `
    <section class="booking-page">
      <a class="back-link" [routerLink]="['/prestador', prestador?.id]">← Voltar para o perfil</a>

      <div class="heading">
        <p class="eyebrow">Novo agendamento</p>
        <h1>{{ prestador?.nomeEstabelecimento || 'Agendar atendimento' }}</h1>
      </div>

      <div class="steps" aria-label="Etapas do agendamento">
        <span [class.active]="step >= 1">1 Serviço</span>
        <span [class.active]="step >= 2">2 Data e horário</span>
        <span [class.active]="step >= 3">3 Confirmação</span>
      </div>

      <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>
      <div class="success-message" *ngIf="successMessage"><p>{{ successMessage }}</p><a class="btn btn-primary" routerLink="/meus-agendamentos">Ver meus agendamentos</a></div>

      <div class="booking-card" *ngIf="!loading && !successMessage">
        <ng-container *ngIf="step === 1">
          <h2>Escolha um serviço</h2>
          <div class="service-options" *ngIf="servicos.length; else noServices">
            <button
              class="service-option"
              *ngFor="let servico of servicos"
              [class.selected]="selectedService?.id === servico.id"
              (click)="selectService(servico)"
            >
              <span>
                <strong>{{ servico.nome }}</strong>
                <small>{{ servico.descricao }} · {{ servico.duracaoMinutos | duration }}</small>
              </span>
              <b>{{ servico.preco | currency }}</b>
            </button>
          </div>
          <ng-template #noServices><p>Este prestador não possui serviços disponíveis.</p></ng-template>
          <button class="btn btn-primary next-button" [disabled]="!selectedService" (click)="nextStep()">Continuar</button>
        </ng-container>

        <ng-container *ngIf="step === 2">
          <h2>Escolha data e horário</h2>
          <label class="field">
            <span>Data do atendimento</span>
            <input type="date" [(ngModel)]="date" name="date" [min]="minimumDate" (change)="loadTimeSlots()">
          </label>

          <div class="slot-section" *ngIf="date">
            <span class="field-label">Horários disponíveis</span>
            <p class="loading-state" *ngIf="loadingSlots">Buscando horários...</p>
            <div class="slots" *ngIf="!loadingSlots && timeSlots.length">
              <button
                class="slot"
                *ngFor="let slot of timeSlots"
                [class.selected]="selectedTime === slot.hora"
                [disabled]="!slot.disponivel"
                (click)="selectedTime = slot.hora"
              >{{ slot.hora }}</button>
            </div>
            <p class="empty-state" *ngIf="!loadingSlots && !timeSlots.length">Não há horários disponíveis nessa data.</p>
          </div>

          <div class="actions">
            <button class="btn btn-secondary" (click)="previousStep()">Voltar</button>
            <button class="btn btn-primary" [disabled]="!date || !selectedTime" (click)="nextStep()">Continuar</button>
          </div>
        </ng-container>

        <ng-container *ngIf="step === 3">
          <h2>Confirme seu agendamento</h2>
          <div class="summary">
            <div><span>Prestador</span><strong>{{ prestador?.nomeEstabelecimento }}</strong></div>
            <div><span>Serviço</span><strong>{{ selectedService?.nome }}</strong></div>
            <div><span>Data e horário</span><strong>{{ date | date:'dd/MM/yyyy' }} às {{ selectedTime }}</strong></div>
            <div><span>Valor</span><strong>{{ selectedService?.preco || 0 | currency }}</strong></div>
          </div>

          <label class="field">
            <span>Forma de pagamento</span>
            <select [(ngModel)]="payment" name="payment">
              <option value="pix">Pix</option>
              <option value="cartao">Cartão</option>
              <option value="dinheiro">Dinheiro</option>
            </select>
          </label>
          <label class="field">
            <span>Observações (opcional)</span>
            <textarea [(ngModel)]="notes" name="notes" rows="3" placeholder="Algum detalhe para o prestador?"></textarea>
          </label>

          <div class="actions">
            <button class="btn btn-secondary" [disabled]="saving" (click)="previousStep()">Voltar</button>
            <button class="btn btn-success" [disabled]="saving" (click)="confirmBooking()">
              {{ saving ? 'Confirmando...' : 'Confirmar agendamento' }}
            </button>
          </div>
        </ng-container>
      </div>

      <div class="loading-state" *ngIf="loading">Carregando agendamento...</div>
    </section>
  `,
  styles: [`
    .booking-page { max-width: 980px; margin: 0 auto; }
    .back-link { display: inline-flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-xl); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); }
    .heading { margin-bottom: var(--space-lg); }
    .heading h1 { margin: 0; }
    .eyebrow { color: var(--color-success-dark); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); margin: 0 0 var(--space-xs); text-transform: uppercase; letter-spacing: 0.08em; }
    .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-sm); margin-bottom: var(--space-xl); padding: var(--space-sm); background: var(--color-neutral-100); border-radius: var(--radius-lg); }
    .steps span { padding: 0.75rem var(--space-sm); border-radius: var(--radius-md); color: var(--color-neutral-500); font-size: var(--font-size-sm); text-align: center; }
    .steps span.active { color: var(--color-primary); background: white; box-shadow: var(--shadow-sm); font-weight: var(--font-weight-bold); }
    .booking-card { padding: clamp(var(--space-lg), 4vw, var(--space-2xl)); background: white; border: 1px solid var(--color-neutral-200); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
    .booking-card h2 { margin-top: 0; }
    .service-options { display: grid; gap: var(--space-md); }
    .service-option { display: flex; align-items: center; justify-content: space-between; gap: var(--space-lg); width: 100%; padding: var(--space-lg); border: 1px solid var(--color-neutral-200); border-left: 4px solid transparent; border-radius: var(--radius-md); background: white; text-align: left; }
    .service-option:hover, .service-option.selected { border-color: var(--color-primary); border-left-color: var(--color-success); background: #f7faff; }
    .service-option span { display: grid; gap: var(--space-xs); }
    .service-option small { color: var(--color-neutral-600); font-weight: var(--font-weight-regular); }
    .service-option b { color: var(--color-success-dark); white-space: nowrap; }
    .field { display: grid; gap: var(--space-xs); margin-bottom: var(--space-lg); }
    .field span, .field-label { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-neutral-800); }
    .slot-section { margin-top: var(--space-xl); }
    .slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: var(--space-sm); margin-top: var(--space-md); }
    .slot { padding: var(--space-md); border: 1px solid var(--color-neutral-200); border-radius: var(--radius-md); background: white; }
    .slot:hover:not(:disabled), .slot.selected { color: white; background: var(--color-primary); border-color: var(--color-primary); }
    .slot:disabled { color: var(--color-neutral-400); background: var(--color-neutral-100); cursor: not-allowed; text-decoration: line-through; }
    .summary { display: grid; gap: var(--space-md); margin-bottom: var(--space-xl); padding: var(--space-lg); background: var(--color-neutral-50); border: 1px solid var(--color-neutral-200); border-radius: var(--radius-md); }
    .summary div { display: flex; justify-content: space-between; gap: var(--space-lg); }
    .summary span { color: var(--color-neutral-600); }
    .summary strong { text-align: right; }
    .actions { display: flex; justify-content: flex-end; gap: var(--space-md); margin-top: var(--space-xl); }
    .btn { padding: var(--space-md) var(--space-lg); }
    .btn:disabled { cursor: not-allowed; opacity: 0.6; }
    .error-message, .success-message { padding: var(--space-md); border-radius: var(--radius-md); margin-bottom: var(--space-lg); }
    .error-message { color: var(--color-danger-dark); background: #fff1f0; }
    .success-message { color: var(--color-success-dark); background: #e8f5e9; text-align: center; }
    .loading-state, .empty-state { padding: var(--space-lg); color: var(--color-neutral-600); text-align: center; }
    @media (max-width: 600px) { .booking-card { padding: var(--space-lg); } .steps span { font-size: var(--font-size-xs); } .service-option, .summary div { align-items: start; flex-direction: column; } .summary strong { text-align: left; } .actions { flex-direction: column-reverse; } .actions .btn, .next-button { width: 100%; } }
  `]
})
export class AgendarComponent implements OnInit {
  prestador?: Prestador;
  servicos: Servico[] = [];
  selectedService?: Servico;
  timeSlots: TimeSlot[] = [];
  currentUser?: Usuario;
  step = 1;
  date = '';
  selectedTime = '';
  payment: MetodoPagamento = 'pix';
  notes = '';
  minimumDate = toLocalDateKey(new Date());
  loading = true;
  loadingSlots = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  reschedulingAppointmentId = '';
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prestadorService: PrestadorService,
    private servicoService: ServicoService,
    private disponibilidadeService: DisponibilidadeService,
    private agendamentoService: AgendamentoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const prestadorId = this.route.snapshot.paramMap.get('prestadorId');
    const serviceId = this.route.snapshot.queryParamMap.get('servico');
    this.reschedulingAppointmentId = this.route.snapshot.queryParamMap.get('reagendar') || '';
    this.currentUser = undefined;

    this.authService
      .getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => (this.currentUser = user || undefined));

    if (!prestadorId) {
      this.errorMessage = 'Prestador não informado.';
      this.loading = false;
      return;
    }

    this.prestadorService.getById(prestadorId).subscribe({
      next: prestador => {
        this.prestador = prestador;
        if (!prestador) {
          this.errorMessage = 'Não encontramos esse prestador.';
          this.loading = false;
          return;
        }

        this.servicoService.getByPrestador(prestador.id).subscribe({
          next: servicos => {
            this.servicos = servicos;
            this.selectedService = servicos.find(servico => servico.id === serviceId);
            this.loading = false;
          },
          error: () => this.setLoadError('Não foi possível carregar os serviços.')
        });
      },
      error: () => this.setLoadError('Não foi possível carregar o prestador.')
    });
  }

  selectService(servico: Servico) {
    this.selectedService = servico;
  }

  nextStep() {
    if (this.step === 1 && this.selectedService) this.step = 2;
    else if (this.step === 2 && this.date && this.selectedTime) this.step = 3;
    this.errorMessage = '';
  }

  previousStep() {
    this.step = Math.max(1, this.step - 1);
    this.errorMessage = '';
  }

  loadTimeSlots() {
    this.selectedTime = '';
    this.timeSlots = [];
    this.errorMessage = '';
    if (!this.date || !this.selectedService || !this.prestador) return;

    this.loadingSlots = true;
    const selectedDate = new Date(`${this.date}T00:00:00`);
    this.disponibilidadeService.getHorariosDisponiveis(
      this.prestador.id,
      selectedDate,
      this.selectedService.duracaoMinutos
    ).subscribe({
      next: slots => {
        this.timeSlots = slots;
        this.loadingSlots = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os horários.';
        this.loadingSlots = false;
      }
    });
  }

  confirmBooking() {
    if (!this.currentUser || !this.prestador || !this.selectedService || !this.date || !this.selectedTime) {
      this.errorMessage = 'Complete os dados do agendamento antes de confirmar.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    const agendamento: Agendamento = {
      id: '',
      clienteId: this.currentUser.id,
      prestadorId: this.prestador.id,
      servicoId: this.selectedService.id,
      dataHora: `${this.date}T${this.selectedTime}:00`,
      duracao: this.selectedService.duracaoMinutos,
      status: 'pendente',
      pagamento: this.payment,
      valor: this.selectedService.preco,
      notas: this.notes.trim() || undefined
    };

    const saveRequest = this.reschedulingAppointmentId
      ? this.agendamentoService.reschedule(
        this.reschedulingAppointmentId,
        agendamento.dataHora,
        this.currentUser.id
      )
      : this.agendamentoService.create(agendamento);

    saveRequest.subscribe({
      next: created => {
        this.saving = false;
        this.router.navigate(['/meus-agendamentos'], {
          queryParams: { agendamento: created.id, criado: 'sucesso' }
        });
      },
      error: error => {
        this.saving = false;
        this.errorMessage = error.message || 'Não foi possível criar o agendamento.';
      }
    });
  }

  private setLoadError(message: string) {
    this.errorMessage = message;
    this.loading = false;
  }
}

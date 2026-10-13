import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Agendamento,
  MetodoPagamento,
  Prestador,
  Servico,
  TimeSlot,
  Usuario,
} from '../../../core/models/types';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { AuthService } from '../../../core/services/auth.service';
import { DisponibilidadeService } from '../../../core/services/disponibilidade.service';
import { PrestadorService } from '../../../core/services/prestador.service';
import { ServicoService } from '../../../core/services/servico.service';
import { CurrencyPipe, DurationPipe } from '../../../shared/pipes/formatting.pipes';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe, DurationPipe],
  templateUrl: './agendar.component.html',
  styleUrl: './agendar.component.css',
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
  minimumDate = new Date().toISOString().split('T')[0];
  loading = true;
  loadingSlots = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prestadorService: PrestadorService,
    private servicoService: ServicoService,
    private disponibilidadeService: DisponibilidadeService,
    private agendamentoService: AgendamentoService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const prestadorId = this.route.snapshot.paramMap.get('prestadorId');
    const serviceId = this.route.snapshot.queryParamMap.get('servico');
    this.currentUser = undefined;

    this.authService.getCurrentUser().subscribe((user) => (this.currentUser = user || undefined));

    if (!prestadorId) {
      this.errorMessage = 'Prestador não informado.';
      this.loading = false;
      return;
    }

    this.prestadorService.getById(prestadorId).subscribe({
      next: (prestador) => {
        this.prestador = prestador;
        if (!prestador) {
          this.errorMessage = 'Não encontramos esse prestador.';
          this.loading = false;
          return;
        }

        this.servicoService.getByPrestador(prestador.id).subscribe({
          next: (servicos) => {
            this.servicos = servicos;
            this.selectedService = servicos.find((servico) => servico.id === serviceId);
            this.loading = false;
          },
          error: () => this.setLoadError('Não foi possível carregar os serviços.'),
        });
      },
      error: () => this.setLoadError('Não foi possível carregar o prestador.'),
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
    this.disponibilidadeService
      .getHorariosDisponiveis(
        this.prestador.id,
        this.selectedService.id,
        selectedDate,
        this.selectedService.duracaoMinutos,
      )
      .subscribe({
        next: (slots) => {
          this.timeSlots = slots;
          this.loadingSlots = false;
        },
        error: () => {
          this.errorMessage = 'Não foi possível carregar os horários.';
          this.loadingSlots = false;
        },
      });
  }

  confirmBooking() {
    if (
      !this.currentUser ||
      !this.prestador ||
      !this.selectedService ||
      !this.date ||
      !this.selectedTime
    ) {
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
      notas: this.notes.trim() || undefined,
    };

    this.agendamentoService.create(agendamento).subscribe({
      next: (created) => {
        this.saving = false;
        this.successMessage = `Agendamento criado com sucesso. Código: ${created.id}`;
      },
      error: (error) => {
        this.saving = false;
        this.errorMessage = error.message || 'Não foi possível criar o agendamento.';
      },
    });
  }

  private setLoadError(message: string) {
    this.errorMessage = message;
    this.loading = false;
  }
}

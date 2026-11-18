import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
import { AppointmentService } from '../../../core/services/appointment.service';
import { AuthService } from '../../../core/services/auth.service';
import { AvailabilityService } from '../../../core/services/availability.service';
import { ProviderService } from '../../../core/services/provider.service';
import { ServiceCatalogService } from '../../../core/services/service-catalog.service';
import { CurrencyPipe, DurationPipe } from '../../../shared/pipes/formatting.pipes';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe, DurationPipe],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit {
  private readonly changeDetector = inject(ChangeDetectorRef);
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
  minimumDate = this.toDateInputValue(new Date());
  loading = true;
  loadingSlots = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  private slotsRequest = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prestadorService: ProviderService,
    private servicoService: ServiceCatalogService,
    private disponibilidadeService: AvailabilityService,
    private agendamentoService: AppointmentService,
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
    if (this.step === 2 && this.date) {
      this.loadTimeSlots();
    }
  }

  nextStep() {
    if (this.step === 1 && this.selectedService) {
      this.step = 2;
      if (!this.date) this.date = this.minimumDate;
      setTimeout(() => this.loadTimeSlots(), 0);
    } else if (this.step === 2 && this.date && this.selectedTime) {
      this.step = 3;
    }
    this.errorMessage = '';
  }

  previousStep() {
    this.step = Math.max(1, this.step - 1);
    this.errorMessage = '';
  }

  loadTimeSlots() {
    const requestId = ++this.slotsRequest;
    const requestDate = this.date;
    this.selectedTime = '';
    this.timeSlots = [];
    this.errorMessage = '';
    if (!requestDate || !this.selectedService || !this.prestador) {
      this.loadingSlots = false;
      return;
    }

    this.loadingSlots = true;
    const selectedDate = new Date(`${requestDate}T00:00:00`);
    this.disponibilidadeService
      .getHorariosDisponiveis(
        this.prestador.id,
        this.selectedService.id,
        selectedDate,
        this.selectedService.duracaoMinutos,
      )
      .subscribe({
        next: (slots) => {
          if (requestId !== this.slotsRequest || this.date !== requestDate) return;
          this.timeSlots = slots;
          this.loadingSlots = false;
          this.changeDetector.markForCheck();
        },
        error: () => {
          if (requestId !== this.slotsRequest || this.date !== requestDate) return;
          this.errorMessage = 'Não foi possível carregar os horários.';
          this.loadingSlots = false;
          this.changeDetector.markForCheck();
        },
      });
  }

  onDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.onDateChange(input.value);
  }

  onDateChange(value: string): void {
    this.date = value;
    this.loadTimeSlots();
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

  private toDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

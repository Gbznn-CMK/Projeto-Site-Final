import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Agendamento, StatusAgendamento, Usuario } from '../../core/models/types';
import { AppointmentService } from '../../core/services/appointment.service';
import { AuthService } from '../../core/services/auth.service';
import { ProviderService } from '../../core/services/provider.service';
import { ServiceCatalogService } from '../../core/services/service-catalog.service';
import { UserService } from '../../core/services/user.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { DateTimePipe, CurrencyPipe } from '../../shared/pipes/formatting.pipes';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-provider-agenda',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatusBadgeComponent,
    DateTimePipe,
    CurrencyPipe,
    ConfirmModalComponent,
  ],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css',
})
export class AgendaComponent implements OnInit {
  appointments: {
    agendamento: Agendamento;
    clientName: string;
    clientPhone: string;
    serviceName: string;
  }[] = [];
  filteredAppointments: {
    agendamento: Agendamento;
    clientName: string;
    clientPhone: string;
    serviceName: string;
  }[] = [];
  filters = [
    { label: 'Todos', value: 'todos' },
    { label: 'Pendentes', value: 'pendente' },
    { label: 'Confirmados', value: 'confirmado' },
    { label: 'Concluídos', value: 'concluido' },
    { label: 'Cancelados', value: 'cancelado' },
  ];
  filter = 'todos';
  loading = true;
  errorMessage = '';
  private prestadorId = '';
  dateFilter: 'all' | 'today' | 'tomorrow' | 'week' = 'all';
  editingId = '';
  editingDate = '';
  appointmentToDelete: Agendamento | null = null;

  constructor(
    private authService: AuthService,
    private prestadorService: ProviderService,
    private agendamentoService: AppointmentService,
    private servicoService: ServiceCatalogService,
    private usuarioService: UserService,
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (!user) {
        this.loading = false;
        return;
      }
      this.prestadorService.getByUsuarioId(user.id).subscribe((prestador) => {
        if (prestador) {
          this.prestadorId = prestador.id;
          this.loadAppointments();
        } else this.loading = false;
      });
    });
  }

  private loadAppointments() {
    this.agendamentoService.getByPrestador(this.prestadorId).subscribe((appointments) => {
      if (!appointments.length) {
        this.loading = false;
        return;
      }
      let loaded = 0;
      appointments.forEach((appointment) => {
        this.servicoService.getById(appointment.servicoId).subscribe((service) => {
          this.usuarioService
            .getById(appointment.clienteId)
            .subscribe((client: Usuario | undefined) => {
              this.appointments.push({
                agendamento: appointment,
                serviceName: service?.nome || 'Serviço',
                clientName: client?.nome || 'Cliente',
                clientPhone: client?.telefone || '',
              });
              loaded++;
              if (loaded === appointments.length) {
                this.appointments.sort(
                  (a, b) =>
                    new Date(a.agendamento.dataHora).getTime() -
                    new Date(b.agendamento.dataHora).getTime(),
                );
                this.applyFilter();
                this.loading = false;
              }
            });
        });
      });
    });
  }

  applyFilter() {
    const byStatus =
      this.filter === 'todos'
        ? this.appointments
        : this.appointments.filter((item) => item.agendamento.status === this.filter);
    this.filteredAppointments = byStatus.filter((item) =>
      this.matchesDate(item.agendamento.dataHora),
    );
  }

  setFilter(value: string) {
    this.filter = value;
    this.applyFilter();
  }

  changeStatus(appointment: Agendamento, status: StatusAgendamento) {
    this.agendamentoService.updateStatus(appointment.id, status).subscribe({
      next: (updated) => {
        appointment.status = updated.status;
        this.applyFilter();
      },
      error: (error) =>
        (this.errorMessage = error.message || 'Não foi possível atualizar o status.'),
    });
  }

  setDate(filter: 'all' | 'today' | 'tomorrow' | 'week') {
    this.dateFilter = filter;
    this.applyFilter();
  }

  startEditing(item: {
    agendamento: Agendamento;
    clientName: string;
    clientPhone: string;
    serviceName: string;
  }) {
    this.editingId = item.agendamento.id;
    this.editingDate = item.agendamento.dataHora.slice(0, 16);
  }

  cancelEditing() {
    this.editingId = '';
    this.editingDate = '';
  }

  saveEditedAppointment(item: {
    agendamento: Agendamento;
    clientName: string;
    clientPhone: string;
    serviceName: string;
  }) {
    if (!this.editingDate) {
      this.errorMessage = 'Informe a nova data e horário.';
      return;
    }
    this.agendamentoService
      .rescheduleByPrestador(item.agendamento.id, this.editingDate, this.prestadorId)
      .subscribe({
        next: (updated) => {
          item.agendamento.dataHora = updated.dataHora;
          item.agendamento.status = updated.status;
          this.cancelEditing();
          this.applyFilter();
        },
        error: (error) =>
          (this.errorMessage = error.message || 'Não foi possível editar o agendamento.'),
      });
  }

  deleteAppointment(appointment: Agendamento) {
    this.appointmentToDelete = appointment;
  }

  confirmDeleteAppointment() {
    const appointment = this.appointmentToDelete;
    this.closeDeleteConfirmation();
    if (!appointment) return;
    this.agendamentoService.deleteByPrestador(appointment.id, this.prestadorId).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(
          (item) => item.agendamento.id !== appointment.id,
        );
        this.applyFilter();
      },
      error: (error) =>
        (this.errorMessage = error.message || 'Não foi possível apagar o agendamento.'),
    });
  }

  closeDeleteConfirmation() {
    this.appointmentToDelete = null;
  }

  whatsappUrl(phone: string, clientName: string): string {
    const digits = phone.replace(/\D/g, '');
    const number = digits.startsWith('55') ? digits : `55${digits}`;
    return `https://wa.me/${number}?text=${encodeURIComponent(`Olá, ${clientName}! Estou entrando em contato sobre seu agendamento.`)}`;
  }

  private matchesDate(dataHora: string): boolean {
    if (this.dateFilter === 'all') return true;
    const date = new Date(dataHora);
    const target = new Date();
    target.setHours(0, 0, 0, 0);
    if (this.dateFilter === 'tomorrow') target.setDate(target.getDate() + 1);
    if (this.dateFilter === 'week') {
      const day = target.getDay();
      const daysUntilNextMonday = day === 0 ? 1 : 8 - day;
      target.setDate(target.getDate() + daysUntilNextMonday);
      const end = new Date(target);
      end.setDate(end.getDate() + 7);
      return date >= target && date < end;
    }
    return date.toDateString() === target.toDateString();
  }
}

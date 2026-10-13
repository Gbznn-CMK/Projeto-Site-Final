import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Agendamento, Prestador, Servico, Usuario } from '../../../core/models/types';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { AuthService } from '../../../core/services/auth.service';
import { PrestadorService } from '../../../core/services/prestador.service';
import { ServicoService } from '../../../core/services/servico.service';
import { AppointmentCardComponent } from '../../../shared/components/appointment-card/appointment-card.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-meus-agendamentos',
  standalone: true,
  imports: [CommonModule, RouterLink, AppointmentCardComponent, ConfirmModalComponent],
  templateUrl: './meus-agendamentos.component.html',
  styleUrl: './meus-agendamentos.component.css',
})
export class MeusAgendamentosComponent implements OnInit {
  appointments: { agendamento: Agendamento; providerName: string; serviceName: string }[] = [];
  currentUser?: Usuario;
  loading = true;
  errorMessage = '';
  confirmationAction: 'cancel' | 'completion' | null = null;
  private pendingAppointment?: Agendamento;

  constructor(
    private authService: AuthService,
    private agendamentoService: AgendamentoService,
    private prestadorService: PrestadorService,
    private servicoService: ServicoService,
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user || undefined;
      if (this.currentUser) this.loadAppointments(this.currentUser.id);
    });
  }

  private loadAppointments(clienteId: string) {
    this.agendamentoService.getByCliente(clienteId).subscribe({
      next: (agendamentos) => {
        if (!agendamentos.length) {
          this.loading = false;
          return;
        }

        let loaded = 0;
        agendamentos.forEach((agendamento) => {
          let providerName = 'Prestador';
          let serviceName = 'Serviço';
          this.prestadorService.getById(agendamento.prestadorId).subscribe((prestador) => {
            providerName = prestador?.nomeEstabelecimento || providerName;
            this.servicoService.getById(agendamento.servicoId).subscribe((servico) => {
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
      },
    });
  }

  isUpcoming(agendamento: Agendamento): boolean {
    return (
      agendamento.status !== 'cancelado' && new Date(agendamento.dataHora).getTime() > Date.now()
    );
  }

  cancelAppointment(agendamento: Agendamento) {
    if (!this.currentUser) return;
    this.pendingAppointment = agendamento;
    this.confirmationAction = 'cancel';
  }

  confirmCompletion(agendamento: Agendamento) {
    if (!this.currentUser) return;
    this.pendingAppointment = agendamento;
    this.confirmationAction = 'completion';
  }

  executeConfirmation() {
    const appointment = this.pendingAppointment;
    const action = this.confirmationAction;
    const user = this.currentUser;
    this.closeConfirmation();
    if (!appointment || !user) return;

    if (action === 'cancel') {
    this.agendamentoService.cancel(appointment.id, user.id).subscribe({
      next: () => {
        appointment.status = 'cancelado';
      },
      error: (error) => {
        this.errorMessage = error.message || 'Não foi possível cancelar o agendamento.';
      },
    });
    } else {
      this.agendamentoService
      .confirmCompletionByClient(appointment.id, user.id)
      .subscribe({
        next: (updated) =>
          (appointment.clienteConfirmouConclusao = updated.clienteConfirmouConclusao),
        error: (error) =>
          (this.errorMessage = error.message || 'Não foi possível confirmar a conclusão.'),
      });
    }
  }

  closeConfirmation() {
    this.confirmationAction = null;
    this.pendingAppointment = undefined;
  }

  private finishLoading() {
    this.appointments.sort(
      (first, second) =>
        new Date(first.agendamento.dataHora).getTime() -
        new Date(second.agendamento.dataHora).getTime(),
    );
    this.loading = false;
  }
}

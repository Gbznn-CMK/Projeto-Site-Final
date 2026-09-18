import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Agendamento, AgendamentoService } from '../../core/services/agendamento';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-agenda-prestador',
  imports: [CommonModule, RouterLink],
  templateUrl: './agenda-prestador.html',
  styleUrl: './agenda-prestador.css',
})
export class AgendaPrestadorComponent implements OnInit {
  collapsed = false;
  mobileExpanded = false;
  profileMenuOpen = false;
  notificationsOpen = false;
  agendamentos: Agendamento[] = [];
  selectedAppointment: (typeof this.agendaDemo)[number] | null = null;

  readonly agendaDemo = [
    { horario: '09:00', cliente: 'João Silva', servico: 'Corte masculino', status: 'Confirmado' },
    { horario: '10:30', cliente: 'Maria Souza', servico: 'Barba e toalha quente', status: 'Pendente' },
    { horario: '14:00', cliente: 'Ana Costa', servico: 'Manicure', status: 'Confirmado' },
  ];

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly agendamentoService: AgendamentoService,
  ) {}

  ngOnInit(): void {
    this.agendamentos = this.agendamentoService.obterAgendamentos();
  }

  get userName(): string {
    return this.auth.currentUser()?.nome || 'Prestador';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  toggleSidebar(): void {
    if (this.isMobile()) {
      this.mobileExpanded = !this.mobileExpanded;
    } else {
      this.collapsed = !this.collapsed;
    }
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
  }

  openAppointmentDetails(appointment: (typeof this.agendaDemo)[number]): void {
    this.selectedAppointment = appointment;
  }

  closeAppointmentDetails(): void {
    this.selectedAppointment = null;
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isMobile()) {
      this.mobileExpanded = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeAppointmentDetails();
  }

  private isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= 860;
  }
}

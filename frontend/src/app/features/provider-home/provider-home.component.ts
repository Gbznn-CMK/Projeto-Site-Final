import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Agendamento } from '../../core/models/types';
import { AppointmentService } from '../../core/services/appointment.service';
import { Notificacao, NotificationService } from '../../core/services/notification.service';
import { UserService } from '../../core/services/user.service';
import { ProviderService } from '../../core/services/provider.service';

@Component({
  selector: 'app-provider-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './provider-home.component.html',
  styleUrl: './provider-home.component.css',
})
export class ProviderHome implements OnInit {
  constructor(
    private readonly auth: AuthService,
    private readonly agendamentoService: AppointmentService,
    private readonly notificacaoService: NotificationService,
    private readonly usuarioService: UserService,
    private readonly prestadorService: ProviderService,
  ) {}

  searchTerm = '';
  filterMenuOpen = false;
  selectedCategory = '';
  selectedSort = 'relevance';
  notificationsOpen = false;
  notificacoes: Notificacao[] = [];

  private agendamentos: Agendamento[] = [];
  private receita = 0;
  private prestadorNome = 'Prestador';

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe((user) => {
      if (!user) return;

      this.prestadorNome = user.nome;

      this.usuarioService.getByEmail(user.email).subscribe((coreUser) => {
        if (!coreUser) return;
        this.prestadorService.getByUsuarioId(coreUser.id).subscribe((prestador) => {
          if (!prestador) return;
          this.agendamentoService.getByPrestador(prestador.id).subscribe((agendamentos) => {
            this.agendamentos = agendamentos.filter((item) => item.status !== 'cancelado');
            this.receita = this.agendamentos.reduce((total, item) => total + item.valor, 0);
          });
          this.notificacaoService.paraUsuario(prestador.id, 'prestador').subscribe({
            next: (notificacoes) => (this.notificacoes = notificacoes),
          });
        });
      });
    });
  }

  get agendamentosAtivos(): number {
    return this.agendamentos.length;
  }

  get receitaPrevista(): string {
    return this.receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  get notificationCount(): number {
    return this.notificacoes.length;
  }

  get userName(): string {
    return this.prestadorNome;
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  toggleFilterMenu(): void {
    this.filterMenuOpen = !this.filterMenuOpen;
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedSort = 'relevance';
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
  }
}

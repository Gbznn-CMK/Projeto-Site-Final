import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Agendamento } from '../../core/models/types';
import { AgendamentoService } from '../../core/services/agendamento.service';
import { Notificacao, NotificacaoService } from '../../core/services/notificacao.service';

@Component({
  selector: 'app-home-prestador',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home-prestador.html',
  styleUrl: './home-prestador.css',
})
export class HomePrestador implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly agendamentoService: AgendamentoService,
    private readonly notificacaoService: NotificacaoService,
  ) {}

  collapsed = false;
  profileMenuOpen = false;
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

      this.agendamentoService.getByPrestador(user.id).subscribe((agendamentos) => {
        this.agendamentos = agendamentos.filter((item) => item.status !== 'cancelado');
        this.receita = this.agendamentos.reduce((total, item) => total + item.valor, 0);
      });
      this.notificacaoService.paraUsuario(user.id, 'prestador').subscribe({
        next: notificacoes => this.notificacoes = notificacoes,
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

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }


  toggleFilterMenu(): void {
    this.filterMenuOpen = !this.filterMenuOpen;
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedSort = 'relevance';
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
  }

  logout(): void {
    this.profileMenuOpen = false;
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  @HostListener('window:resize')
  onResize(): void {
    // Mantém o comportamento do menu estável ao redimensionar a janela.
  }
}

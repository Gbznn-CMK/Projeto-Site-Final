import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { AgendamentoService } from '../../core/services/agendamento';

@Component({
  selector: 'app-home-prestador',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home-prestador.html',
  styleUrl: './home-prestador.css',
})
export class HomePrestador {
  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly agendamentoService: AgendamentoService,
  ) {}

  collapsed = false;
  profileMenuOpen = false;
  searchTerm = '';
  filterMenuOpen = false;
  selectedCategory = '';
  selectedSort = 'relevance';
  notificationsOpen = false;

  readonly agendaDemo = [
    { horario: '09:00', cliente: 'João Silva', servico: 'Corte masculino' },
    { horario: '10:30', cliente: 'Maria Souza', servico: 'Barba e toalha quente' },
    { horario: '14:00', cliente: 'Ana Costa', servico: 'Manicure' },
  ];

  get agendamentosAtivos(): number {
    const reais = this.agendamentoService.obterAgendamentos().filter((item) => item.status !== 'Cancelado').length;
    return Math.max(reais, this.agendaDemo.length);
  }

  get receitaPrevista(): string {
    const reais = this.agendamentoService.obterAgendamentos()
      .filter((item) => item.status !== 'Cancelado')
      .reduce((total, item) => total + Number(item.valor.replace(/[^\d,]/g, '').replace(',', '.')), 0);
    return (reais || 275).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  get userName(): string {
    return this.auth.currentUser()?.nome || 'Prestador';
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

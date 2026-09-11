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

  get userName(): string {
    return this.auth.currentUser()?.nome || 'Prestador';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  get activeAppointments(): number {
    return this.agendamentoService.obterAgendamentos()
      .filter((item) => item.status === 'Confirmado').length;
  }

  get pendingAppointments(): number {
    return this.agendamentoService.obterAgendamentos()
      .filter((item) => item.status === 'Pendente').length;
  }

  get projectedRevenue(): string {
    const total = this.agendamentoService.obterAgendamentos()
      .filter((item) => item.status !== 'Cancelado')
      .reduce((sum, item) => sum + Number.parseFloat(item.valor.replace(/[^\d,.-]/g, '').replace(',', '.')), 0);
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

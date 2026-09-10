import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// Imports com o nome exato da interface (Agendamento)
import { AgendamentoService } from '../../../../core/services/agendamento';
import { Agendamento } from '../../../../core/models/agendamento';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-lista-agendamentos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lista-agendamentos.html',
  styleUrls: ['./lista-agendamentos.css']
})
export class ListaAgendamentosComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  collapsed = false;
  mobileExpanded = false;
  profileMenuOpen = false;

  constructor(
    private agendamentoService: AgendamentoService,
    private router: Router,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    this.agendamentos = this.agendamentoService.obterAgendamentos();
  }

  novoAgendamento() {
    this.router.navigate(['/agendamentos/novo']);
  }

  cancelar(id: number) {
    if (!window.confirm('Deseja realmente cancelar este agendamento?')) {
      return;
    }
    this.agendamentoService.cancelarAgendamento(id);
    this.carregarAgendamentos();
  }

  get userName(): string {
    return this.auth.currentUser()?.nome || 'Cliente';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  logout(): void {
    this.profileMenuOpen = false;
    this.auth.logout();
    void this.router.navigate(['/login']);
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

  private isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= 860;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isMobile()) {
      this.mobileExpanded = false;
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

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

  constructor(
    private agendamentoService: AgendamentoService,
    private router: Router,
    private auth: AuthService
  ) {}

  get userName(): string {
    return this.auth.currentUser()?.nome || 'Cliente';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  get isProvider(): boolean {
    return this.auth.currentUser()?.tipoUsuario === 'prestador';
  }

  get roleLabel(): string {
    return this.isProvider ? 'Prestador' : 'Cliente';
  }

  get pageEyebrow(): string {
    return this.isProvider ? 'ÁREA DO PRESTADOR' : 'ÁREA DO CLIENTE';
  }

  get pageTitle(): string {
    return this.isProvider ? 'Agenda' : 'Meus agendamentos';
  }

  ngOnInit() {
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    this.agendamentos = this.agendamentoService.obterAgendamentos();
  }

  novoAgendamento(): void {
    this.router.navigate(['/agendamentos/novo']);
  }

  cancelar(id: number) {
    if (typeof window !== 'undefined' &&
      !window.confirm('Deseja realmente cancelar este agendamento?')) {
      return;
    }
    this.agendamentoService.cancelarAgendamento(id);
    this.carregarAgendamentos();
  }
}
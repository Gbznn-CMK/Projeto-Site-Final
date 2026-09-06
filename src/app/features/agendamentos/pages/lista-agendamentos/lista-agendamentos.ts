import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Imports com o nome exato da interface (Agendamento)
import { AgendamentoService } from '../../../../core/services/agendamento';
import { Agendamento } from '../../../../core/services/agendamento';

@Component({
  selector: 'app-lista-agendamentos',
  templateUrl: './lista-agendamentos.html',
  styleUrls: ['./lista-agendamentos.css']
})
export class ListaAgendamentosComponent implements OnInit {
  agendamentos: Agendamento[] = [];

  constructor(
    private agendamentoService: AgendamentoService,
    private router: Router
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
    this.agendamentoService.cancelarAgendamento(id);
    this.carregarAgendamentos();
  }
}
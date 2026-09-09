import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AgendamentoService } from '../../../../core/services/agendamento';
import { Servico } from '../../../../core/models/agendamento';

@Component({
  selector: 'app-novo-agendamento',
  templateUrl: './novo-agendamento.html',
  styleUrls: ['./novo-agendamento.css']
})
export class NovoAgendamentoComponent {
  passoAtual: number = 2;

  servicosDisponiveis: Servico[] = [
    { id: 1, nome: 'Corte Completo', duracao: '30 min', preco: 'R$ 45,00' },
    { id: 2, nome: 'Barba e Toalha Quente', duracao: '30 min', preco: 'R$ 35,00' },
    { id: 3, nome: 'Combo Cabelo + Barba', duracao: '50 min', preco: 'R$ 70,00' }
  ];

  servicoSelecionado: Servico = this.servicosDisponiveis[0];
  dataSelecionada = '';
  horarioSelecionado = '';

  constructor(
    public agendamentoService: AgendamentoService,
    private router: Router
  ) {}

  selecionarServico(servico: Servico) {
    this.servicoSelecionado = servico;
    this.passoAtual = 3;
  }

  confirmarDataHora(data: string, horario: string): void {
    if (!data || !horario) {
      return;
    }
    this.dataSelecionada = data;
    this.horarioSelecionado = horario;
    this.passoAtual = 4;
  }

  finalizarAgendamento(): void {
    this.agendamentoService.adicionarAgendamento(
    'Barbearia Gemeos',
    this.servicoSelecionado,
    this.dataSelecionada,
    this.horarioSelecionado
    );
    void this.router.navigate(['/agendamentos']);
  }

  reiniciar() {
    this.passoAtual = 2;
  }
}
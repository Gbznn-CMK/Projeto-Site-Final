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
  mensagemErro = '';
  readonly estabelecimentoSelecionado = 'Barbearia Central';

  servicosDisponiveis: Servico[] = [
    { id: 1, nome: 'Corte Completo', duracao: '30 min', preco: 'R$ 45,00' },
    { id: 2, nome: 'Barba e Toalha Quente', duracao: '30 min', preco: 'R$ 35,00' },
    { id: 3, nome: 'Combo Cabelo + Barba', duracao: '50 min', preco: 'R$ 70,00' }
  ];

  servicoSelecionado: Servico = this.servicosDisponiveis[0];
  dataSelecionada = '';
  horarioSelecionado = '';

  get dataMinima(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  constructor(
    public agendamentoService: AgendamentoService,
    private router: Router
  ) {}

  selecionarServico(servico: Servico) {
    this.servicoSelecionado = servico;
    this.mensagemErro = '';
    this.passoAtual = 3;
  }

  confirmarDataHora(data: string, horario: string): void {
    if (!data || !horario) {
      this.mensagemErro = 'Informe uma data e um horário para continuar.';
      return;
    }

    const agora = new Date();
    const selecionado = new Date(`${data}T${horario}`);
    if (Number.isNaN(selecionado.getTime()) || selecionado <= agora) {
      this.mensagemErro = 'Escolha um horário futuro. Não é possível agendar no passado.';
      return;
    }

    this.dataSelecionada = data;
    this.horarioSelecionado = horario;
    this.mensagemErro = '';
    this.passoAtual = 4;
  }

  finalizarAgendamento(): void {
    this.agendamentoService.adicionarAgendamento(
    this.estabelecimentoSelecionado,
    this.servicoSelecionado,
    this.dataSelecionada,
    this.horarioSelecionado
    );
    void this.router.navigate(['/agendamentos']);
  }

  reiniciar() {
    this.mensagemErro = '';
    this.passoAtual = 2;
  }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Imports separados:
import { AgendamentoService } from '../../../../core/services/agendamento';
import { Servico } from '../../../../core/services/agendamento';

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
  dataSelecionada: string = '2026-09-06';
  horarioSelecionado: string = '14:22';

  constructor(
    public agendamentoService: AgendamentoService,
    private router: Router
  ) {}

  selecionarServico(servico: Servico) {
    this.servicoSelecionado = servico;
    this.passoAtual = 3;
  }

  confirmarDataHora(data: string, horario: string) {
    this.dataSelecionada = data || '2026-09-06';
    this.horarioSelecionado = horario || '14:22';
    this.passoAtual = 4;
  }

finalizarAgendamento() {
  console.log('CLIQUEI NO BOTÃO');

  this.agendamentoService.adicionarAgendamento(
    'Barbearia Gemeos',
    this.servicoSelecionado,
    this.dataSelecionada,
    this.horarioSelecionado
  );

  console.log('AGENDAMENTO SALVO');
  console.log(this.agendamentoService.obterAgendamentos());

  this.router.navigate(['/agendamentos']).then((sucesso) => {
    console.log('NAVEGAÇÃO:', sucesso);

    if (!sucesso) {
      console.log('NÃO CONSEGUIU NAVEGAR');
      this.passoAtual = 5;
    }
  });
}

  reiniciar() {
    this.passoAtual = 2;
  }
}
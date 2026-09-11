import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  duracao: string;
  preco: string;
}

@Component({
  selector: 'app-novo-agendamento',
  templateUrl: './novo-agendamento.html',
  styleUrls: ['./novo-agendamento.css'],
  imports: [FormsModule]
})
export class NovoAgendamentoComponent {


  formatarData(data: string): string {
  if (!data) {
    return '';
  }

  const [ano, mes, dia] = data.split('-');

  return `${dia}/${mes}/${ano}`;
} 


    constructor(private router: Router) {}
  
  nomeLoja = 'Barbearia Gêmeos';

  servicos: Servico[] = [
    {
      id: 1,
      nome: 'Corte Completo',
      descricao: 'Corte masculino completo',
      duracao: '30 min',
      preco: 'R$ 45,00'
    },
    {
      id: 2,
      nome: 'Barba e Toalha Quente',
      descricao: 'Barba completa com toalha quente',
      duracao: '30 min',
      preco: 'R$ 35,00'
    },
    {
      id: 3,
      nome: 'Corte + Barba',
      descricao: 'Combo completo de cabelo e barba',
      duracao: '50 min',
      preco: 'R$ 70,00'
    }
  ];

  servicoSelecionado: Servico | null = null;

  etapaAtual: number = 1;

  dataSelecionada: string = '';

  horarioSelecionado: string = '';

  horarios: string[] = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00'
];
dataDigitada: string = '';
erroData: boolean = false;


  selecionarServico(servico: Servico) {
    this.servicoSelecionado = servico;
  }

  continuar() {
    if (this.servicoSelecionado) {
      this.etapaAtual = 2;
    }
  }

  voltarParaServicos() {
    this.etapaAtual = 1;
  }

  continuarParaHorario() {
    if (this.dataSelecionada) {
      this.etapaAtual = 3;
    }
  }
  voltarParaData() {
  this.etapaAtual = 2;
}

selecionarHorario(horario: string) {
  this.horarioSelecionado = horario;
}

continuarParaConfirmacao() {
  if (this.horarioSelecionado) {
    this.etapaAtual = 4;
  }
}

voltarParaHorario() {
  this.etapaAtual = 3;
}

confirmarAgendamento() {
  const novoAgendamento = {
    id: Date.now(),
    loja: this.nomeLoja,
    servico: this.servicoSelecionado?.nome,
    data: this.dataSelecionada,
    horario: this.horarioSelecionado,
    valor: this.servicoSelecionado?.preco,
    status: 'Confirmado'
  };

  const agendamentosSalvos = localStorage.getItem('agendamentos');

  const agendamentos = agendamentosSalvos
    ? JSON.parse(agendamentosSalvos)
    : [];

  agendamentos.unshift(novoAgendamento);

  localStorage.setItem(
    'agendamentos',
    JSON.stringify(agendamentos)
  );

  this.etapaAtual = 5;
}
verAgendamentos() {
  this.router.navigate(['/agendamentos']);
}
digitarData(valor: string) {

  // deixa somente números
  let numeros = valor.replace(/\D/g, '');

  // limita a 8 números: DDMMAAAA
  numeros = numeros.substring(0, 8);

  // coloca as barras automaticamente
  if (numeros.length > 4) {
    this.dataDigitada =
      numeros.substring(0, 2) + '/' +
      numeros.substring(2, 4) + '/' +
      numeros.substring(4);
  }
  else if (numeros.length > 2) {
    this.dataDigitada =
      numeros.substring(0, 2) + '/' +
      numeros.substring(2);
  }
  else {
    this.dataDigitada = numeros;
  }

  this.dataSelecionada = '';
  this.erroData = false;

  // só valida quando DD/MM/AAAA estiver completo
  if (numeros.length === 8) {

    const dia = Number(numeros.substring(0, 2));
    const mes = Number(numeros.substring(2, 4));
    const ano = Number(numeros.substring(4, 8));

    const data = new Date(ano, mes - 1, dia);

    const dataValida =
      data.getFullYear() === ano &&
      data.getMonth() === mes - 1 &&
      data.getDate() === dia;

    if (dataValida) {

      const diaFormatado = String(dia).padStart(2, '0');
      const mesFormatado = String(mes).padStart(2, '0');

      // continua salvando no formato padrão
      this.dataSelecionada =
        `${ano}-${mesFormatado}-${diaFormatado}`;

    } else {
      this.erroData = true;
    }
  }
}

}
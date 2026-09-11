import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Agendamento {
  id: number;
  loja: string;
  servico: string;
  data: string;
  horario: string;
  valor: string;
  status: string;
}

@Component({
  selector: 'app-lista-agendamentos',
  templateUrl: './lista-agendamentos.html',
  styleUrls: ['./lista-agendamentos.css']
})
export class ListaAgendamentosComponent implements OnInit {
  
  formatarData(data: string): string {
  if (!data) {
    return '';
  }

  const [ano, mes, dia] = data.split('-');

  return `${dia}/${mes}/${ano}`;
}


excluirAgendamento(id: number) {
  this.agendamentos = this.agendamentos.filter(
    agendamento => agendamento.id !== id
  );

  localStorage.setItem(
    'agendamentos',
    JSON.stringify(this.agendamentos)
  );
}

constructor(private router: Router) {}

  agendamentos: Agendamento[] = [];

  ngOnInit() {
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    const dados = localStorage.getItem('agendamentos');

    this.agendamentos = dados
      ? JSON.parse(dados)
      : [];
  }

  cancelarAgendamento(id: number) {

    const agendamento = this.agendamentos.find(
      item => item.id === id
    );

    if (agendamento) {
      agendamento.status = 'Cancelado';

      localStorage.setItem(
        'agendamentos',
        JSON.stringify(this.agendamentos)
      );
    }
  }
  voltarInicio() {
  this.router.navigate(['/']);
}

}
import { Injectable } from '@angular/core';

export interface Servico {
  id: number;
  nome: string;
  duracao: string;
  preco: string;
}

export interface Agendamento {
  id: number;
  empresa: string;
  servico: string;
  valor: string;
  data: string;
  horario: string;
  status: 'Pendente' | 'Confirmado' | 'Cancelado';
}

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  agendamentos: Agendamento[] = [
    {
      id: 1,
      empresa: 'Barbearia Gemeos',
      servico: 'Corte Completo',
      valor: 'R$ 45,00',
      data: '2026-09-06',
      horario: '14:22',
      status: 'Confirmado'
    }
  ];

  obterAgendamentos(): Agendamento[] {
    return this.agendamentos;
  }

  adicionarAgendamento(estabelecimento: string, servico: Servico, data: string, horario: string) {
    const novo: Agendamento = {
      id: Date.now(),
      empresa: estabelecimento,
      servico: servico?.nome || 'Corte Completo',
      valor: servico?.preco || 'R$ 45,00',
      data: data || '2026-09-06',
      horario: horario || '14:00',
      status: 'Confirmado'
    };

    this.agendamentos.unshift(novo);
  }

  cancelarAgendamento(id: number) {
    const item = this.agendamentos.find(a => a.id === id);
    if (item) {
      item.status = 'Cancelado';
    }
  }
}
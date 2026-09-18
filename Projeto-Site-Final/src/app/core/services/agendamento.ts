import { Injectable } from '@angular/core';
import { Agendamento, Servico } from '../models/agendamento';

export type { Agendamento, Servico } from '../models/agendamento';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private readonly storageKey = 'nahora-agendamentos';

  obterAgendamentos(): Agendamento[] {
    return this.read();
  }

  adicionarAgendamento(estabelecimento: string, servico: Servico, data: string, horario: string): Agendamento {
    if (!estabelecimento.trim() || !servico || !data || !horario) {
      throw new Error('Todos os dados do agendamento são obrigatórios.');
    }

    const novo: Agendamento = {
      id: Date.now(),
      empresa: estabelecimento,
      servico: servico.nome,
      valor: servico.preco,
      data,
      horario,
      status: 'Confirmado'
    };

    const agendamentos = this.read();
    agendamentos.unshift(novo);
    this.write(agendamentos);
    return novo;
  }

  cancelarAgendamento(id: number): boolean {
    const agendamentos = this.read();
    const item = agendamentos.find(a => a.id === id);
    if (item) {
      item.status = 'Cancelado';
      this.write(agendamentos);
      return true;
    }
    return false;
  }

  private read(): Agendamento[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed as Agendamento[] : [];
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }

  private write(agendamentos: Agendamento[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(agendamentos));
    }
  }
}
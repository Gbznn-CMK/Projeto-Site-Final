import { Injectable } from '@angular/core';
import { Agendamento, Servico } from '../models/agendamento';

export type { Agendamento, Servico } from '../models/agendamento';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private readonly storageKey = 'nahora-agendamentos';

  obterAgendamentos(clienteEmail?: string): Agendamento[] {
    const agendamentos = this.read();
    if (!clienteEmail) {
      return agendamentos;
    }

    const email = this.normalizarEmail(clienteEmail);
    return agendamentos.filter((agendamento) => agendamento.clienteEmail && this.normalizarEmail(agendamento.clienteEmail) === email);
  }

  adicionarAgendamento(
    estabelecimento: string,
    servico: Servico,
    data: string,
    horario: string,
    clienteEmail?: string,
  ): Agendamento {
    if (!estabelecimento.trim() || !servico || !data || !horario) {
      throw new Error('Todos os dados do agendamento são obrigatórios.');
    }

    if (!this.isHorarioDisponivel(estabelecimento, data, horario, servico)) {
      throw new Error('Este horário entra em conflito com outro agendamento. Escolha outro horário.');
    }

    const novo: Agendamento = {
      id: Date.now(),
      ...(clienteEmail ? { clienteEmail: this.normalizarEmail(clienteEmail) } : {}),
      empresa: estabelecimento,
      servico: servico.nome,
      duracaoMinutos: this.obterDuracaoEmMinutos(servico.duracao),
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

  cancelarAgendamento(id: number, clienteEmail?: string): boolean {
    const agendamentos = this.read();
    const item = agendamentos.find(a => a.id === id);
    if (item && (!clienteEmail || item.clienteEmail === this.normalizarEmail(clienteEmail))) {
      item.status = 'Cancelado';
      this.write(agendamentos);
      return true;
    }
    return false;
  }

  isHorarioDisponivel(estabelecimento: string, data: string, horario: string, servico: Servico): boolean {
    const inicio = this.horaEmMinutos(horario);
    const duracao = this.obterDuracaoEmMinutos(servico.duracao);
    if (inicio === null || duracao <= 0) {
      return false;
    }

    const fim = inicio + duracao;
    return !this.read().some((agendamento) => {
      if (agendamento.empresa !== estabelecimento || agendamento.data !== data || agendamento.status === 'Cancelado') {
        return false;
      }

      const outroInicio = this.horaEmMinutos(agendamento.horario);
      if (outroInicio === null) {
        return false;
      }

      const outroFim = outroInicio + (agendamento.duracaoMinutos ?? 30);
      return inicio < outroFim && fim > outroInicio;
    });
  }

  private obterDuracaoEmMinutos(duracao: string): number {
    const valor = Number.parseInt(duracao, 10);
    if (!Number.isFinite(valor) || valor <= 0) {
      return 0;
    }
    return duracao.toLowerCase().includes('hora') ? valor * 60 : valor;
  }

  private horaEmMinutos(horario: string): number | null {
    const [hora, minuto] = horario.split(':').map(Number);
    if (!Number.isInteger(hora) || !Number.isInteger(minuto) || hora < 0 || hora > 23 || minuto < 0 || minuto > 59) {
      return null;
    }
    return hora * 60 + minuto;
  }

  private normalizarEmail(email: string): string {
    return email.trim().toLowerCase();
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
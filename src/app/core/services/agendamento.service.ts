import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Agendamento, StatusAgendamento } from '../models/types';
import { MOCK_AGENDAMENTOS } from '../data/mock-data';
import { getLocalStorage } from '../utils/storage';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private readonly PREFIX = 'nahora_';
  private readonly CANCELLATION_HOURS = 24; // Must cancel 24h before

  private getAgendamentos(): Agendamento[] {
    const data = getLocalStorage()?.getItem(`${this.PREFIX}agendamentos`);
    return data ? JSON.parse(data) : MOCK_AGENDAMENTOS;
  }

  private saveAgendamentos(agendamentos: Agendamento[]) {
    getLocalStorage()?.setItem(`${this.PREFIX}agendamentos`, JSON.stringify(agendamentos));
  }

  private isTimeSlotAvailable(
    prestadorId: string,
    dataHora: string,
    duracao: number,
    excludeId?: string
  ): boolean {
    const agendamentos = this.getAgendamentos();
    const [appointmentDate, appointmentTime] = dataHora.split('T');
    const [appointmentH, appointmentM] = appointmentTime.substring(0, 5).split(':').map(Number);

    const appointmentStart = appointmentH * 60 + appointmentM;
    const appointmentEnd = appointmentStart + duracao;

    return !agendamentos.some(a => {
      if (a.id === excludeId || a.prestadorId !== prestadorId) return false;
      if (a.status === 'cancelado') return false; // Canceled appointments don't block

      const [aDate, aTime] = a.dataHora.split('T');
      if (aDate !== appointmentDate) return false;

      const [aH, aM] = aTime.substring(0, 5).split(':').map(Number);
      const aStart = aH * 60 + aM;
      const aEnd = aStart + a.duracao;

      // Check for overlap
      return !(appointmentEnd <= aStart || appointmentStart >= aEnd);
    });
  }

  private canCancelOrReschedule(dataHora: string): boolean {
    const appointmentTime = new Date(dataHora);
    const now = new Date();
    const hoursDifference = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDifference >= this.CANCELLATION_HOURS;
  }

  create(agendamento: Agendamento): Observable<Agendamento> {
    return new Observable(observer => {
      setTimeout(() => {
        // Check if time slot is available
        if (!this.isTimeSlotAvailable(agendamento.prestadorId, agendamento.dataHora, agendamento.duracao)) {
          observer.error(new Error('Horário não está disponível'));
          return;
        }

        const agendamentos = this.getAgendamentos();
        const newAgendamento: Agendamento = {
          ...agendamento,
          id: `agend-${Date.now()}`,
          status: 'pendente',
          dataCadastro: new Date().toISOString()
        };

        agendamentos.push(newAgendamento);
        this.saveAgendamentos(agendamentos);

        observer.next(newAgendamento);
        observer.complete();
      }, 500);
    });
  }

  getByCliente(clienteId: string): Observable<Agendamento[]> {
    return of(this.getAgendamentos().filter(a => a.clienteId === clienteId));
  }

  getByPrestador(prestadorId: string): Observable<Agendamento[]> {
    return of(this.getAgendamentos().filter(a => a.prestadorId === prestadorId));
  }

  getById(agendamentoId: string): Observable<Agendamento | undefined> {
    return of(this.getAgendamentos().find(a => a.id === agendamentoId));
  }

  updateStatus(agendamentoId: string, novoStatus: StatusAgendamento): Observable<Agendamento> {
    return new Observable(observer => {
      setTimeout(() => {
        const agendamentos = this.getAgendamentos();
        const agendamento = agendamentos.find(a => a.id === agendamentoId);

        if (!agendamento) {
          observer.error(new Error('Agendamento não encontrado'));
          return;
        }

        agendamento.status = novoStatus;
        this.saveAgendamentos(agendamentos);

        observer.next(agendamento);
        observer.complete();
      }, 300);
    });
  }

  cancel(agendamentoId: string, clienteId: string): Observable<void> {
    return new Observable(observer => {
      setTimeout(() => {
        const agendamentos = this.getAgendamentos();
        const agendamento = agendamentos.find(a => a.id === agendamentoId);

        if (!agendamento) {
          observer.error(new Error('Agendamento não encontrado'));
          return;
        }

        if (agendamento.clienteId !== clienteId) {
          observer.error(new Error('Você não pode cancelar este agendamento'));
          return;
        }

        if (!this.canCancelOrReschedule(agendamento.dataHora)) {
          observer.error(new Error('Agendamento não pode ser cancelado com menos de 24 horas de antecedência'));
          return;
        }

        agendamento.status = 'cancelado';
        this.saveAgendamentos(agendamentos);

        observer.next();
        observer.complete();
      }, 500);
    });
  }

  reschedule(
    agendamentoId: string,
    novaDataHora: string,
    clienteId: string
  ): Observable<Agendamento> {
    return new Observable(observer => {
      setTimeout(() => {
        const agendamentos = this.getAgendamentos();
        const agendamento = agendamentos.find(a => a.id === agendamentoId);

        if (!agendamento) {
          observer.error(new Error('Agendamento não encontrado'));
          return;
        }

        if (agendamento.clienteId !== clienteId) {
          observer.error(new Error('Você não pode reagendar este agendamento'));
          return;
        }

        if (!this.canCancelOrReschedule(agendamento.dataHora)) {
          observer.error(new Error('Agendamento não pode ser reagendado com menos de 24 horas de antecedência'));
          return;
        }

        // Check if new time slot is available
        if (!this.isTimeSlotAvailable(
          agendamento.prestadorId,
          novaDataHora,
          agendamento.duracao,
          agendamentoId
        )) {
          observer.error(new Error('Novo horário não está disponível'));
          return;
        }

        agendamento.dataHora = novaDataHora;
        agendamento.status = 'pendente';
        this.saveAgendamentos(agendamentos);

        observer.next(agendamento);
        observer.complete();
      }, 500);
    });
  }

  // Check if a specific time slot is available (for UI validation)
  isAvailable(prestadorId: string, dataHora: string, duracao: number): boolean {
    return this.isTimeSlotAvailable(prestadorId, dataHora, duracao);
  }

  // Check if appointment can be canceled/rescheduled
  canCancel(dataHora: string): boolean {
    return this.canCancelOrReschedule(dataHora);
  }
}

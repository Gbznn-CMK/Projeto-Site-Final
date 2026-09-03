import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Agendamento, Bloqueio, StatusAgendamento } from '../models/types';
import { MOCK_AGENDAMENTOS, MOCK_BLOQUEIOS } from '../data/mock-data';
import { getLocalStorage } from '../utils/storage';
import { StorageKeys } from '../utils/storage-keys';
import { isSlotAvailable } from '../../shared/utils/schedule.utils';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private readonly CANCELLATION_HOURS = 24; // Must cancel 24h before

  private getAgendamentos(): Agendamento[] {
    const data = getLocalStorage()?.getItem(StorageKeys.AGENDAMENTOS);
    return data ? JSON.parse(data) : MOCK_AGENDAMENTOS;
  }

  private saveAgendamentos(agendamentos: Agendamento[]) {
    getLocalStorage()?.setItem(StorageKeys.AGENDAMENTOS, JSON.stringify(agendamentos));
  }

  private getBloqueios(): Bloqueio[] {
    const data = getLocalStorage()?.getItem(StorageKeys.BLOQUEIOS);
    return data ? JSON.parse(data) : MOCK_BLOQUEIOS;
  }

  private isTimeSlotAvailable(
    prestadorId: string,
    dataHora: string,
    duracao: number,
    excludeId?: string
  ): boolean {
    return isSlotAvailable(
      this.getAgendamentos(),
      this.getBloqueios(),
      prestadorId,
      dataHora,
      duracao,
      excludeId
    );
  }

  private canCancelOrReschedule(dataHora: string): boolean {
    const appointmentTime = new Date(dataHora);
    const now = new Date();
    const hoursDifference = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDifference >= this.CANCELLATION_HOURS;
  }

  create(agendamento: Agendamento): Observable<Agendamento> {
    if (
      !this.isTimeSlotAvailable(
        agendamento.prestadorId,
        agendamento.dataHora,
        agendamento.duracao
      )
    ) {
      return throwError(() => new Error('Horário não está disponível'));
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

    return of(newAgendamento);
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
    const agendamentos = this.getAgendamentos();
    const agendamento = agendamentos.find(a => a.id === agendamentoId);

    if (!agendamento) {
      return throwError(() => new Error('Agendamento não encontrado'));
    }

    agendamento.status = novoStatus;
    this.saveAgendamentos(agendamentos);

    return of(agendamento);
  }

  cancel(agendamentoId: string, clienteId: string): Observable<void> {
    const agendamentos = this.getAgendamentos();
    const agendamento = agendamentos.find(a => a.id === agendamentoId);

    if (!agendamento) {
      return throwError(() => new Error('Agendamento não encontrado'));
    }

    if (agendamento.clienteId !== clienteId) {
      return throwError(() => new Error('Você não pode cancelar este agendamento'));
    }

    if (!this.canCancelOrReschedule(agendamento.dataHora)) {
      return throwError(
        () =>
          new Error(
            'Agendamento não pode ser cancelado com menos de 24 horas de antecedência'
          )
      );
    }

    agendamento.status = 'cancelado';
    this.saveAgendamentos(agendamentos);

    return of(undefined);
  }

  reschedule(
    agendamentoId: string,
    novaDataHora: string,
    clienteId: string
  ): Observable<Agendamento> {
    const agendamentos = this.getAgendamentos();
    const agendamento = agendamentos.find(a => a.id === agendamentoId);

    if (!agendamento) {
      return throwError(() => new Error('Agendamento não encontrado'));
    }

    if (agendamento.clienteId !== clienteId) {
      return throwError(() => new Error('Você não pode reagendar este agendamento'));
    }

    if (!this.canCancelOrReschedule(agendamento.dataHora)) {
      return throwError(
        () =>
          new Error(
            'Agendamento não pode ser reagendado com menos de 24 horas de antecedência'
          )
      );
    }

    if (
      !this.isTimeSlotAvailable(
        agendamento.prestadorId,
        novaDataHora,
        agendamento.duracao,
        agendamentoId
      )
    ) {
      return throwError(() => new Error('Novo horário não está disponível'));
    }

    agendamento.dataHora = novaDataHora;
    agendamento.status = 'pendente';
    this.saveAgendamentos(agendamentos);

    return of(agendamento);
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

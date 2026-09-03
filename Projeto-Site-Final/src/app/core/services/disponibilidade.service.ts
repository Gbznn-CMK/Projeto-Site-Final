import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Agendamento, Disponibilidade, Bloqueio, TimeSlot } from '../models/types';
import { MOCK_DISPONIBILIDADES, MOCK_BLOQUEIOS, MOCK_AGENDAMENTOS } from '../data/mock-data';
import { getLocalStorage } from '../utils/storage';
import { StorageKeys } from '../utils/storage-keys';
import {
  generateTimeSlots,
  timeToMinutes,
  jsToAppDay,
  toLocalDateKey
} from '../../shared/utils/time.utils';
import { isSlotAvailable } from '../../shared/utils/schedule.utils';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadeService {
  private getDisponibilidades(): Disponibilidade[] {
    const data = getLocalStorage()?.getItem(StorageKeys.DISPONIBILIDADES);
    return data ? JSON.parse(data) : MOCK_DISPONIBILIDADES;
  }

  private saveDisponibilidades(disponibilidades: Disponibilidade[]) {
    getLocalStorage()?.setItem(StorageKeys.DISPONIBILIDADES, JSON.stringify(disponibilidades));
  }

  private loadBloqueios(): Bloqueio[] {
    const data = getLocalStorage()?.getItem(StorageKeys.BLOQUEIOS);
    return data ? JSON.parse(data) : MOCK_BLOQUEIOS;
  }

  private saveBloqueios(bloqueios: Bloqueio[]) {
    getLocalStorage()?.setItem(StorageKeys.BLOQUEIOS, JSON.stringify(bloqueios));
  }

  private getAgendamentos(): Agendamento[] {
    const data = getLocalStorage()?.getItem(StorageKeys.AGENDAMENTOS);
    return data ? JSON.parse(data) : MOCK_AGENDAMENTOS;
  }

  getHorariosDisponiveis(
    prestadorId: string,
    data: Date,
    duracaoMinutos: number
  ): Observable<TimeSlot[]> {
    const diaSemana = jsToAppDay(data.getDay());
    const disponibilidades = this.getDisponibilidades().filter(
      d => d.prestadorId === prestadorId && d.diaSemana === diaSemana && d.ativo
    );

    if (disponibilidades.length === 0) {
      return of([]);
    }

    // Generate all candidate slots that fit within the availability ranges.
    const allSlots: string[] = [];
    disponibilidades.forEach(d => {
      const endOfService = timeToMinutes(d.horaFim);
      allSlots.push(
        ...generateTimeSlots(d.horaInicio, d.horaFim).filter(
          hora => timeToMinutes(hora) + duracaoMinutos <= endOfService
        )
      );
    });

    // Deduplicate slots that can be produced by overlapping ranges.
    const uniqueSlots = [...new Set(allSlots)];

    const dateKey = toLocalDateKey(data);

    // The single source of truth decides whether each slot is free.
    const timeSlots: TimeSlot[] = uniqueSlots.map(hora => ({
      hora,
      disponivel: isSlotAvailable(
        this.getAgendamentos(),
        this.loadBloqueios(),
        prestadorId,
        `${dateKey}T${hora}:00`,
        duracaoMinutos
      )
    }));

    return of(timeSlots);
  }

  getDisponibilidadesForPrestador(prestadorId: string): Observable<Disponibilidade[]> {
    return of(this.getDisponibilidades().filter(d => d.prestadorId === prestadorId));
  }

  updateDisponibilidades(
    prestadorId: string,
    disponibilidades: Disponibilidade[]
  ): Observable<void> {
    let allDisp = this.getDisponibilidades();
    allDisp = allDisp.filter(d => d.prestadorId !== prestadorId);
    allDisp.push(...disponibilidades);
    this.saveDisponibilidades(allDisp);
    return of(undefined);
  }

  blockTime(
    prestadorId: string,
    dataHora: string,
    duracao: number,
    motivo?: string
  ): Observable<Bloqueio> {
    const bloqueios = this.loadBloqueios();
    const newBloqueio: Bloqueio = {
      id: `bloq-${Date.now()}`,
      prestadorId,
      dataHora,
      duracao,
      motivo,
      dataCadastro: new Date().toISOString()
    };
    bloqueios.push(newBloqueio);
    this.saveBloqueios(bloqueios);
    return of(newBloqueio);
  }

  unblockTime(bloqueioId: string): Observable<void> {
    const bloqueios = this.loadBloqueios();
    const index = bloqueios.findIndex(b => b.id === bloqueioId);
    if (index >= 0) {
      bloqueios.splice(index, 1);
      this.saveBloqueios(bloqueios);
      return of(undefined);
    }
    return throwError(() => new Error('Bloqueio não encontrado'));
  }

  getBloqueios(prestadorId: string): Observable<Bloqueio[]> {
    return of(this.loadBloqueios().filter(b => b.prestadorId === prestadorId));
  }
}

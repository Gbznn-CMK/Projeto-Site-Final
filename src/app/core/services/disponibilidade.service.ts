import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agendamento, Disponibilidade, Bloqueio, TimeSlot } from '../models/types';
import { MOCK_DISPONIBILIDADES, MOCK_BLOQUEIOS } from '../data/mock-data';
import { AgendamentoService } from './agendamento.service';
import { getLocalStorage } from '../utils/storage';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadeService {
  private readonly PREFIX = 'nahora_';

  constructor(private agendamentoService: AgendamentoService) {}

  private getDisponibilidades(): Disponibilidade[] {
    const data = getLocalStorage()?.getItem(`${this.PREFIX}disponibilidades`);
    return data ? JSON.parse(data) : MOCK_DISPONIBILIDADES;
  }

  private saveDisponibilidades(disponibilidades: Disponibilidade[]) {
    getLocalStorage()?.setItem(`${this.PREFIX}disponibilidades`, JSON.stringify(disponibilidades));
  }

  private loadBloqueios(): Bloqueio[] {
    const data = getLocalStorage()?.getItem(`${this.PREFIX}bloqueios`);
    return data ? JSON.parse(data) : MOCK_BLOQUEIOS;
  }

  private saveBloqueios(bloqueios: Bloqueio[]) {
    getLocalStorage()?.setItem(`${this.PREFIX}bloqueios`, JSON.stringify(bloqueios));
  }

  private generateTimeSlots(startHour: string, endHour: string): string[] {
    const slots: string[] = [];
    const [startH, startM] = startHour.split(':').map(Number);
    const [endH, endM] = endHour.split(':').map(Number);

    let currentH = startH;
    let currentM = startM;

    while (currentH < endH || (currentH === endH && currentM < endM)) {
      slots.push(`${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`);
      currentM += 30;
      if (currentM >= 60) {
        currentM = 0;
        currentH += 1;
      }
    }

    return slots;
  }

  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private addMinutesToTime(timeStr: string, minutes: number): string {
    const [h, m] = timeStr.split(':').map(Number);
    let totalMinutes = h * 60 + m + minutes;
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  }

  private timeToMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  getHorariosDisponiveis(
    prestadorId: string,
    servicoId: string,
    data: Date,
    duracaoMinutos: number
  ): Observable<TimeSlot[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const diaSemana = data.getDay() === 0 ? 6 : data.getDay() - 1; // Convert JS day to 0=Mon
        const disponibilidades = this.getDisponibilidades().filter(
          d => d.prestadorId === prestadorId && d.diaSemana === diaSemana && d.ativo
        );

        if (disponibilidades.length === 0) {
          observer.next([]);
          observer.complete();
          return;
        }

        // Generate all possible slots
        const allSlots: string[] = [];
        disponibilidades.forEach(d => {
          const endOfService = this.timeToMinutes(d.horaFim);
          allSlots.push(...this.generateTimeSlots(d.horaInicio, d.horaFim).filter(hora =>
            this.timeToMinutes(hora) + duracaoMinutos <= endOfService
          ));
        });

        // Get blocked times for this date
        const dateKey = this.getDateKey(data);
        const bloqueios = this.loadBloqueios().filter(b => {
          const bloqueioDate = b.dataHora.split('T')[0];
          return b.prestadorId === prestadorId && bloqueioDate === dateKey;
        });

        const agendamentos = this.loadAgendamentos().filter(agendamento => {
          return agendamento.prestadorId === prestadorId &&
            agendamento.dataHora.split('T')[0] === dateKey &&
            agendamento.status !== 'cancelado';
        });

        // Get appointments for this date (via agendamento service)
        // For now, we'll assume appointments are checked elsewhere
        // This service only checks blocking

        const timeSlots: TimeSlot[] = allSlots.map(hora => {
          // Check if this slot is blocked
          const isBlocked = bloqueios.some(b => {
            const bloqueioHora = b.dataHora.split('T')[1].substring(0, 5);
            const bloqueioEndTime = this.addMinutesToTime(bloqueioHora, b.duracao);
            const slotEndTime = this.addMinutesToTime(hora, duracaoMinutos);

            const bloqueioStart = this.timeToMinutes(bloqueioHora);
            const bloqueioEnd = this.timeToMinutes(bloqueioEndTime);
            const slotStart = this.timeToMinutes(hora);
            const slotEnd = this.timeToMinutes(slotEndTime);

            return !(slotEnd <= bloqueioStart || slotStart >= bloqueioEnd);
          });

          const isBooked = agendamentos.some(agendamento => {
            const appointmentTime = agendamento.dataHora.split('T')[1].substring(0, 5);
            const appointmentStart = this.timeToMinutes(appointmentTime);
            const appointmentEnd = appointmentStart + agendamento.duracao;
            const slotStart = this.timeToMinutes(hora);
            const slotEnd = slotStart + duracaoMinutos;
            return !(slotEnd <= appointmentStart || slotStart >= appointmentEnd);
          });

          return {
            hora,
            disponivel: !isBlocked && !isBooked
          };
        });

        observer.next(timeSlots);
        observer.complete();
      }, 300);
    });
  }

  private loadAgendamentos(): Agendamento[] {
    const data = getLocalStorage()?.getItem(`${this.PREFIX}agendamentos`);
    return data ? JSON.parse(data) : [];
  }

  getDisponibilidadesForPrestador(prestadorId: string): Observable<Disponibilidade[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const disponibilidades = this.getDisponibilidades().filter(
          d => d.prestadorId === prestadorId
        );
        observer.next(disponibilidades);
        observer.complete();
      }, 300);
    });
  }

  updateDisponibilidades(
    prestadorId: string,
    disponibilidades: Disponibilidade[]
  ): Observable<void> {
    return new Observable(observer => {
      setTimeout(() => {
        let allDisp = this.getDisponibilidades();
        // Remove old ones for this provider
        allDisp = allDisp.filter(d => d.prestadorId !== prestadorId);
        // Add new ones
        allDisp.push(...disponibilidades);
        this.saveDisponibilidades(allDisp);
        observer.next();
        observer.complete();
      }, 300);
    });
  }

  blockTime(prestadorId: string, dataHora: string, duracao: number, motivo?: string): Observable<Bloqueio> {
    return new Observable(observer => {
      setTimeout(() => {
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
        observer.next(newBloqueio);
        observer.complete();
      }, 300);
    });
  }

  unblockTime(bloqueioId: string): Observable<void> {
    return new Observable(observer => {
      setTimeout(() => {
        const bloqueios = this.loadBloqueios();
        const index = bloqueios.findIndex(b => b.id === bloqueioId);
        if (index >= 0) {
          bloqueios.splice(index, 1);
          this.saveBloqueios(bloqueios);
          observer.next();
        } else {
          observer.error(new Error('Bloqueio não encontrado'));
        }
        observer.complete();
      }, 300);
    });
  }

  getBloqueios(prestadorId: string): Observable<Bloqueio[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const bloqueios = this.loadBloqueios().filter(b => b.prestadorId === prestadorId);
        observer.next(bloqueios);
        observer.complete();
      }, 300);
    });
  }
}

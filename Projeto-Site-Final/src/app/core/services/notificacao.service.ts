import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agendamento } from '../models/types';
import { AgendamentoService } from './agendamento.service';

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  data: string;
  link: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  paraUsuario(usuarioId: string, tipo: 'cliente' | 'prestador'): Observable<Notificacao[]> {
    const source = tipo === 'cliente'
      ? this.agendamentoService.getByCliente(usuarioId)
      : this.agendamentoService.getByPrestador(usuarioId);

    return new Observable(observer => source.subscribe({
      next: agendamentos => {
        observer.next(this.buildNotifications(agendamentos, tipo));
        observer.complete();
      },
      error: error => observer.error(error),
    }));
  }

  private buildNotifications(agendamentos: Agendamento[], tipo: 'cliente' | 'prestador'): Notificacao[] {
    return agendamentos
      .filter(item => item.status !== 'cancelado')
      .sort((a, b) => new Date(b.dataCadastro || b.dataHora).getTime() - new Date(a.dataCadastro || a.dataHora).getTime())
      .slice(0, 5)
      .map(item => {
        const date = new Date(item.dataHora).toLocaleString('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        });
        if (tipo === 'prestador' && item.status === 'pendente') {
          return { id: item.id, titulo: 'Novo agendamento recebido', mensagem: `Solicitação para ${date}. Confirme ou edite o horário.`, data: item.dataHora, link: '/agenda-prestador' };
        }
        if (item.status === 'confirmado') {
          return { id: item.id, titulo: 'Agendamento confirmado', mensagem: `Seu atendimento está marcado para ${date}.`, data: item.dataHora, link: tipo === 'cliente' ? '/agendamentos' : '/agenda-prestador' };
        }
        if (item.status === 'concluido') {
          return { id: item.id, titulo: 'Atendimento concluído', mensagem: `O atendimento de ${date} foi marcado como concluído.`, data: item.dataHora, link: tipo === 'cliente' ? '/agendamentos' : '/agenda-prestador' };
        }
        return { id: item.id, titulo: 'Agendamento pendente', mensagem: `Aguardando confirmação para ${date}.`, data: item.dataHora, link: tipo === 'cliente' ? '/agendamentos' : '/agenda-prestador' };
      });
  }
}

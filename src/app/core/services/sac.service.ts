import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChamadoSac, StatusChamado } from '../models/types';
import { MOCK_CHAMADOS } from '../data/mock-data';
import { getLocalStorage } from '../utils/storage';

@Injectable({
  providedIn: 'root'
})
export class SacService {
  private readonly PREFIX = 'nahora_';

  private getChamadosFromStorage(): ChamadoSac[] {
    const data = getLocalStorage()?.getItem(`${this.PREFIX}chamados`);
    return data ? JSON.parse(data) : MOCK_CHAMADOS;
  }

  private saveChamados(chamados: ChamadoSac[]) {
    getLocalStorage()?.setItem(`${this.PREFIX}chamados`, JSON.stringify(chamados));
  }

  criarChamado(usuarioId: string, assunto: string, mensagem: string): Observable<ChamadoSac> {
    return new Observable(observer => {
      setTimeout(() => {
        const chamados = this.getChamadosFromStorage();
        const newChamado: ChamadoSac = {
          id: `chamado-${Date.now()}`,
          usuarioId,
          assunto,
          mensagem,
          status: 'aberto',
          dataCadastro: new Date().toISOString()
        };

        chamados.push(newChamado);
        this.saveChamados(chamados);

        observer.next(newChamado);
        observer.complete();
      }, 300);
    });
  }

  getChamados(usuarioId: string, status?: StatusChamado): Observable<ChamadoSac[]> {
    return new Observable(observer => {
      setTimeout(() => {
        let chamados = this.getChamadosFromStorage().filter(c => c.usuarioId === usuarioId);

        if (status) {
          chamados = chamados.filter(c => c.status === status);
        }

        observer.next(chamados);
        observer.complete();
      }, 300);
    });
  }

  getById(chamadoId: string): Observable<ChamadoSac | undefined> {
    return new Observable(observer => {
      setTimeout(() => {
        const chamados = this.getChamadosFromStorage();
        observer.next(chamados.find(c => c.id === chamadoId));
        observer.complete();
      }, 300);
    });
  }

  updateStatus(chamadoId: string, novoStatus: StatusChamado): Observable<ChamadoSac> {
    return new Observable(observer => {
      setTimeout(() => {
        const chamados = this.getChamadosFromStorage();
        const chamado = chamados.find(c => c.id === chamadoId);

        if (!chamado) {
          observer.error(new Error('Chamado não encontrado'));
          return;
        }

        chamado.status = novoStatus;

        if (novoStatus === 'resolvido') {
          chamado.dataResolucao = new Date().toISOString();
        }

        this.saveChamados(chamados);

        observer.next(chamado);
        observer.complete();
      }, 300);
    });
  }

  addResposta(chamadoId: string, resposta: string): Observable<ChamadoSac> {
    return new Observable(observer => {
      setTimeout(() => {
        const chamados = this.getChamadosFromStorage();
        const chamado = chamados.find(c => c.id === chamadoId);

        if (!chamado) {
          observer.error(new Error('Chamado não encontrado'));
          return;
        }

        chamado.resposta = resposta;
        chamado.status = 'em_andamento';

        this.saveChamados(chamados);

        observer.next(chamado);
        observer.complete();
      }, 300);
    });
  }
}

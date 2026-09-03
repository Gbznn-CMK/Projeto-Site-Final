import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ChamadoSac, StatusChamado } from '../models/types';
import { MOCK_CHAMADOS } from '../data/mock-data';
import { getLocalStorage } from '../utils/storage';
import { StorageKeys } from '../utils/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class SacService {
  private getChamadosFromStorage(): ChamadoSac[] {
    const data = getLocalStorage()?.getItem(StorageKeys.CHAMADOS);
    return data ? JSON.parse(data) : MOCK_CHAMADOS;
  }

  private saveChamados(chamados: ChamadoSac[]) {
    getLocalStorage()?.setItem(StorageKeys.CHAMADOS, JSON.stringify(chamados));
  }

  criarChamado(usuarioId: string, assunto: string, mensagem: string): Observable<ChamadoSac> {
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

    return of(newChamado);
  }

  getChamados(usuarioId: string, status?: StatusChamado): Observable<ChamadoSac[]> {
    let chamados = this.getChamadosFromStorage().filter(c => c.usuarioId === usuarioId);

    if (status) {
      chamados = chamados.filter(c => c.status === status);
    }

    return of(chamados);
  }

  getById(chamadoId: string): Observable<ChamadoSac | undefined> {
    return of(this.getChamadosFromStorage().find(c => c.id === chamadoId));
  }

  updateStatus(chamadoId: string, novoStatus: StatusChamado): Observable<ChamadoSac> {
    const chamados = this.getChamadosFromStorage();
    const chamado = chamados.find(c => c.id === chamadoId);

    if (!chamado) {
      return throwError(() => new Error('Chamado não encontrado'));
    }

    chamado.status = novoStatus;

    if (novoStatus === 'resolvido') {
      chamado.dataResolucao = new Date().toISOString();
    }

    this.saveChamados(chamados);

    return of(chamado);
  }

  addResposta(chamadoId: string, resposta: string): Observable<ChamadoSac> {
    const chamados = this.getChamadosFromStorage();
    const chamado = chamados.find(c => c.id === chamadoId);

    if (!chamado) {
      return throwError(() => new Error('Chamado não encontrado'));
    }

    chamado.resposta = resposta;
    chamado.status = 'em_andamento';

    this.saveChamados(chamados);

    return of(chamado);
  }
}

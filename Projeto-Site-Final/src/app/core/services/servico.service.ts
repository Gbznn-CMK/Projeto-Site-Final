import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Servico } from '../models/types';
import { MOCK_SERVICOS } from '../data/mock-data';
import { getLocalStorage } from '../utils/storage';
import { StorageKeys } from '../utils/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private getServicos(): Servico[] {
    const data = getLocalStorage()?.getItem(StorageKeys.SERVICOS);
    return data ? JSON.parse(data) : MOCK_SERVICOS;
  }

  private saveServicos(servicos: Servico[]) {
    getLocalStorage()?.setItem(StorageKeys.SERVICOS, JSON.stringify(servicos));
  }

  getByPrestador(prestadorId: string): Observable<Servico[]> {
    return of(this.getServicos().filter(s => s.prestadorId === prestadorId && s.ativo));
  }

  getAllByPrestador(prestadorId: string): Observable<Servico[]> {
    return of(this.getServicos().filter(s => s.prestadorId === prestadorId));
  }

  getById(servicoId: string): Observable<Servico | undefined> {
    return of(this.getServicos().find(s => s.id === servicoId));
  }

  create(servico: Servico): Observable<Servico> {
    const servicos = this.getServicos();
    const newServico = {
      ...servico,
      id: `serv-${Date.now()}`,
      dataCadastro: new Date().toISOString()
    };
    servicos.push(newServico);
    this.saveServicos(servicos);
    return of(newServico);
  }

  update(servico: Servico): Observable<Servico> {
    const servicos = this.getServicos();
    const index = servicos.findIndex(s => s.id === servico.id);
    if (index >= 0) {
      servicos[index] = servico;
      this.saveServicos(servicos);
      return of(servico);
    }
    return throwError(() => new Error('Serviço não encontrado'));
  }

  delete(servicoId: string): Observable<void> {
    const servicos = this.getServicos();
    const index = servicos.findIndex(s => s.id === servicoId);
    if (index >= 0) {
      servicos.splice(index, 1);
      this.saveServicos(servicos);
      return of(undefined);
    }
    return throwError(() => new Error('Serviço não encontrado'));
  }
}

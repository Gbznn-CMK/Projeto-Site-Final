import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Servico } from '../models/types';
import { MOCK_SERVICOS } from '../data/mock-data';
import { getLocalStorage } from '../utils/storage';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private readonly PREFIX = 'nahora_';

  private getServicos(): Servico[] {
    const data = getLocalStorage()?.getItem(`${this.PREFIX}servicos`);
    return data ? JSON.parse(data) : MOCK_SERVICOS;
  }

  private saveServicos(servicos: Servico[]) {
    getLocalStorage()?.setItem(`${this.PREFIX}servicos`, JSON.stringify(servicos));
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
    return new Observable(observer => {
      setTimeout(() => {
        const servicos = this.getServicos();
        const newServico = {
          ...servico,
          id: `serv-${Date.now()}`,
          dataCadastro: new Date().toISOString()
        };
        servicos.push(newServico);
        this.saveServicos(servicos);
        observer.next(newServico);
        observer.complete();
      }, 300);
    });
  }

  update(servico: Servico): Observable<Servico> {
    return new Observable(observer => {
      setTimeout(() => {
        const servicos = this.getServicos();
        const index = servicos.findIndex(s => s.id === servico.id);
        if (index >= 0) {
          servicos[index] = servico;
          this.saveServicos(servicos);
          observer.next(servico);
        } else {
          observer.error(new Error('Serviço não encontrado'));
        }
        observer.complete();
      }, 300);
    });
  }

  delete(servicoId: string): Observable<void> {
    return new Observable(observer => {
      setTimeout(() => {
        const servicos = this.getServicos();
        const index = servicos.findIndex(s => s.id === servicoId);
        if (index >= 0) {
          servicos.splice(index, 1);
          this.saveServicos(servicos);
          observer.next();
        } else {
          observer.error(new Error('Serviço não encontrado'));
        }
        observer.complete();
      }, 300);
    });
  }
}

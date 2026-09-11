import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Prestador, CATEGORIAS_SERVICOS } from '../models/types';
import { MOCK_PRESTADORES } from '../data/mock-data';
import { getLocalStorage } from '../utils/storage';

@Injectable({
  providedIn: 'root'
})
export class PrestadorService {
  private readonly PREFIX = 'nahora_';

  private getPrestadores(): Prestador[] {
    const data = getLocalStorage()?.getItem(`${this.PREFIX}prestadores`);
    return data ? JSON.parse(data) : MOCK_PRESTADORES;
  }

  private savePrestadores(prestadores: Prestador[]) {
    getLocalStorage()?.setItem(`${this.PREFIX}prestadores`, JSON.stringify(prestadores));
  }

  getAll(): Observable<Prestador[]> {
    return of(this.getPrestadores());
  }

  getById(id: string): Observable<Prestador | undefined> {
    return of(this.getPrestadores().find(p => p.id === id));
  }

  getByUsuarioId(usuarioId: string): Observable<Prestador | undefined> {
    return of(this.getPrestadores().find(p => p.usuarioId === usuarioId));
  }

  search(
    query?: string,
    categoria?: string,
    localizacao?: string
  ): Observable<Prestador[]> {
    let prestadores = this.getPrestadores();

    if (query) {
      const lowerQuery = query.toLowerCase();
      prestadores = prestadores.filter(
        p =>
          p.nomeEstabelecimento.toLowerCase().includes(lowerQuery) ||
          p.descricao?.toLowerCase().includes(lowerQuery)
      );
    }

    if (categoria) {
      prestadores = prestadores.filter(p => p.categoria === categoria);
    }

    if (localizacao) {
      const lowerLoc = localizacao.toLowerCase();
      prestadores = prestadores.filter(p =>
        p.endereco.toLowerCase().includes(lowerLoc)
      );
    }

    return of(prestadores);
  }

  getCategories(): Observable<string[]> {
    return of(CATEGORIAS_SERVICOS);
  }

  create(prestador: Prestador): Observable<Prestador> {
    return new Observable(observer => {
      setTimeout(() => {
        const prestadores = this.getPrestadores();
        const newPrestador = {
          ...prestador,
          id: `prest-${Date.now()}`,
          dataCadastro: new Date().toISOString()
        };
        prestadores.push(newPrestador);
        this.savePrestadores(prestadores);
        observer.next(newPrestador);
        observer.complete();
      }, 300);
    });
  }

  update(prestador: Prestador): Observable<Prestador> {
    return new Observable(observer => {
      setTimeout(() => {
        const prestadores = this.getPrestadores();
        const index = prestadores.findIndex(p => p.id === prestador.id);
        if (index >= 0) {
          prestadores[index] = prestador;
          this.savePrestadores(prestadores);
          observer.next(prestador);
        } else {
          observer.error(new Error('Prestador não encontrado'));
        }
        observer.complete();
      }, 300);
    });
  }

  delete(id: string): Observable<void> {
    return new Observable(observer => {
      setTimeout(() => {
        const prestadores = this.getPrestadores();
        const index = prestadores.findIndex(p => p.id === id);
        if (index >= 0) {
          prestadores.splice(index, 1);
          this.savePrestadores(prestadores);
          observer.next();
        } else {
          observer.error(new Error('Prestador não encontrado'));
        }
        observer.complete();
      }, 300);
    });
  }
}

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Prestador, CATEGORIAS_SERVICOS } from '../models/types';
import { MOCK_PRESTADORES } from '../data/mock-data';
import { getLocalStorage } from '../utils/storage';
import { StorageKeys } from '../utils/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class PrestadorService {
  private getPrestadores(): Prestador[] {
    const data = getLocalStorage()?.getItem(StorageKeys.PRESTADORES);
    return data ? JSON.parse(data) : MOCK_PRESTADORES;
  }

  private savePrestadores(prestadores: Prestador[]) {
    getLocalStorage()?.setItem(StorageKeys.PRESTADORES, JSON.stringify(prestadores));
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
    const prestadores = this.getPrestadores();
    const newPrestador = {
      ...prestador,
      id: `prest-${Date.now()}`,
      dataCadastro: new Date().toISOString()
    };
    prestadores.push(newPrestador);
    this.savePrestadores(prestadores);
    return of(newPrestador);
  }

  update(prestador: Prestador): Observable<Prestador> {
    const prestadores = this.getPrestadores();
    const index = prestadores.findIndex(p => p.id === prestador.id);
    if (index >= 0) {
      prestadores[index] = prestador;
      this.savePrestadores(prestadores);
      return of(prestador);
    }
    return throwError(() => new Error('Prestador não encontrado'));
  }

  delete(id: string): Observable<void> {
    const prestadores = this.getPrestadores();
    const index = prestadores.findIndex(p => p.id === id);
    if (index >= 0) {
      prestadores.splice(index, 1);
      this.savePrestadores(prestadores);
      return of(undefined);
    }
    return throwError(() => new Error('Prestador não encontrado'));
  }
}

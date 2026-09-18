import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Favorito {
  id: number;
  nome: string;
  endereco: string;
  horario: string;
  disponivel: boolean;
  imagemUrl: string;
}

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly storageKey = 'nahora-favoritos';
  private readonly lojas: Favorito[] = [
    { id: 1, nome: 'Barbearia Central', endereco: 'Rua Belterra 291, Bangu, RJ', horario: '09:00-18:00', disponivel: true, imagemUrl: '/img/barbearia.webp' },
    { id: 2, nome: 'Salão da Maria', endereco: 'Av. Paulista 1000, São Paulo, SP', horario: '09:00-19:00', disponivel: true, imagemUrl: '/img/salao-maria.png' },
    { id: 3, nome: 'Nails & More', endereco: 'Rua das Flores 123, Rio de Janeiro, RJ', horario: '10:00-18:00', disponivel: true, imagemUrl: '/img/manicure.png' },
    { id: 4, nome: 'Studio Fit', endereco: 'Rua Ipiranga 55, Niterói, RJ', horario: '06:00-21:00', disponivel: true, imagemUrl: '/img/studio-fit.png' },
  ];

  listarIds(): Observable<number[]> {
    return of(this.readIds());
  }

  listarDetalhes(): Observable<Favorito[]> {
    const ids = new Set(this.readIds());
    return of(this.lojas.filter((loja) => ids.has(loja.id)));
  }

  favoritar(lojaId: number): Observable<void> {
    const ids = new Set(this.readIds());
    ids.add(lojaId);
    this.writeIds([...ids]);
    return of(void 0);
  }

  desfavoritar(lojaId: number): Observable<void> {
    this.writeIds(this.readIds().filter((id) => id !== lojaId));
    return of(void 0);
  }

  private readIds(): number[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.every((id) => typeof id === 'number') ? parsed : [];
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }

  private writeIds(ids: number[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(ids));
    }
  }
}
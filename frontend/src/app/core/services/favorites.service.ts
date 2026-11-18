import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Favorito {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  disponivel: boolean;
  imagemUrl: string;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storageKey = 'nahora-favoritos';
  private readonly lojas: Favorito[] = [
    {
      id: 'prest-1',
      nome: 'Barbearia Central',
      endereco: 'Rua Belterra 291, Bangu, RJ',
      horario: '09:00-18:00',
      disponivel: true,
      imagemUrl: '/img/barbearia.webp',
    },
    {
      id: 'prest-2',
      nome: 'Salão da Maria',
      endereco: 'Av. Paulista 1000, São Paulo, SP',
      horario: '09:00-19:00',
      disponivel: true,
      imagemUrl: '/img/salao-maria.png',
    },
    {
      id: 'prest-3',
      nome: 'Nails & More',
      endereco: 'Rua das Flores 123, Rio de Janeiro, RJ',
      horario: '10:00-18:00',
      disponivel: true,
      imagemUrl: '/img/manicure.png',
    },
    {
      id: 'prest-4',
      nome: 'Studio Fit',
      endereco: 'Rua Ipiranga 55, Niterói, RJ',
      horario: '06:00-21:00',
      disponivel: true,
      imagemUrl: '/img/studio-fit.png',
    },
  ];

  listarIds(): Observable<string[]> {
    return of(this.readIds());
  }

  listarDetalhes(): Observable<Favorito[]> {
    const ids = new Set(this.readIds());
    return of(this.lojas.filter((loja) => ids.has(loja.id)));
  }

  favoritar(lojaId: string | number): Observable<void> {
    const ids = new Set(this.readIds());
    ids.add(this.normalizeId(lojaId));
    this.writeIds([...ids]);
    return of(void 0);
  }

  desfavoritar(lojaId: string | number): Observable<void> {
    const normalizedId = this.normalizeId(lojaId);
    this.writeIds(this.readIds().filter((id) => id !== normalizedId));
    return of(void 0);
  }

  private readIds(): string[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((id): id is string | number => typeof id === 'string' || typeof id === 'number')
        .map((id) => this.normalizeId(id));
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }

  private writeIds(ids: string[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(ids));
    }
  }

  private normalizeId(id: string | number): string {
    return typeof id === 'number' ? `prest-${id}` : id;
  }
}

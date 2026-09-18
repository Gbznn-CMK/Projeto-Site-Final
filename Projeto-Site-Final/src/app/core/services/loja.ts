import { Injectable } from '@angular/core';
import { Loja, ServicoLoja } from '../models/loja';

@Injectable({ providedIn: 'root' })
export class LojaService {
  private readonly lojasKey = 'nahora-lojas';

  listar(): Loja[] {
    return this.read<Loja[]>(this.lojasKey, []);
  }

  criar(loja: Omit<Loja, 'id'>): Loja {
    const novaLoja = { ...loja, id: Date.now() };
    this.write(this.lojasKey, [...this.listar(), novaLoja]);
    return novaLoja;
  }

  obterPorId(id: number): Loja | undefined {
    return this.listar().find((loja) => loja.id === id);
  }

  obterDoPrestador(email: string): Loja | undefined {
    return this.listar().find((loja) => loja.proprietarioEmail === email);
  }

  atualizarServicos(proprietarioEmail: string, servicos: ServicoLoja[]): void {
    const lojas = this.listar().map((loja) =>
      loja.proprietarioEmail === proprietarioEmail ? { ...loja, servicos } : loja,
    );
    this.write(this.lojasKey, lojas);
  }

  listarServicos(lojaId: number): ServicoLoja[] {
    return this.obterPorId(lojaId)?.servicos.filter((servico) => servico.ativo) ?? [];
  }

  private read<T>(key: string, fallback: T): T {
    if (typeof localStorage === 'undefined') {
      return fallback;
    }
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      localStorage.removeItem(key);
      return fallback;
    }
  }

  private write(key: string, value: unknown): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}

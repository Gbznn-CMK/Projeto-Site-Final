import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/types';
import { MOCK_USUARIOS } from '../data/mock-data';
import { getLocalStorage } from '../utils/storage';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly PREFIX = 'nahora_';
  private favoritos$ = new BehaviorSubject<Map<string, string[]>>(new Map());

  constructor() {
    this.loadFavoritos();
  }

  private getUsuarios(): Usuario[] {
    const data = getLocalStorage()?.getItem(`${this.PREFIX}usuarios`);
    return data ? JSON.parse(data) : MOCK_USUARIOS;
  }

  private saveUsuarios(usuarios: Usuario[]) {
    getLocalStorage()?.setItem(`${this.PREFIX}usuarios`, JSON.stringify(usuarios));
  }

  private loadFavoritos() {
    const data = getLocalStorage()?.getItem(`${this.PREFIX}favoritos`);
    const favMap = new Map<string, string[]>();
    if (data) {
      const favObj = JSON.parse(data);
      Object.keys(favObj).forEach(key => {
        favMap.set(key, favObj[key]);
      });
    }
    this.favoritos$.next(favMap);
  }

  private saveFavoritos() {
    const favObj: Record<string, string[]> = {};
    this.favoritos$.value.forEach((value, key) => {
      favObj[key] = value;
    });
    getLocalStorage()?.setItem(`${this.PREFIX}favoritos`, JSON.stringify(favObj));
  }

  getById(id: string): Observable<Usuario | undefined> {
    return new Observable(observer => {
      setTimeout(() => {
        const usuarios = this.getUsuarios();
        observer.next(usuarios.find(u => u.id === id));
        observer.complete();
      }, 300);
    });
  }

  updateProfile(user: Usuario): Observable<void> {
    return new Observable(observer => {
      setTimeout(() => {
        const usuarios = this.getUsuarios();
        const index = usuarios.findIndex(u => u.id === user.id);
        if (index >= 0) {
          usuarios[index] = { ...usuarios[index], ...user };
          this.saveUsuarios(usuarios);
          observer.next();
        } else {
          observer.error(new Error('Usuário não encontrado'));
        }
        observer.complete();
      }, 300);
    });
  }

  getFavorites(usuarioId: string): Observable<string[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const favorites = this.favoritos$.value.get(usuarioId) || [];
        observer.next(favorites);
        observer.complete();
      }, 300);
    });
  }

  toggleFavorite(usuarioId: string, prestadorId: string): Observable<void> {
    return new Observable(observer => {
      setTimeout(() => {
        const favoritos = this.favoritos$.value;
        const userFavs = favoritos.get(usuarioId) || [];
        
        const index = userFavs.indexOf(prestadorId);
        if (index >= 0) {
          userFavs.splice(index, 1);
        } else {
          userFavs.push(prestadorId);
        }
        
        favoritos.set(usuarioId, userFavs);
        this.favoritos$.next(new Map(favoritos));
        this.saveFavoritos();
        
        observer.next();
        observer.complete();
      }, 300);
    });
  }

  isFavorite(usuarioId: string, prestadorId: string): boolean {
    const favs = this.favoritos$.value.get(usuarioId) || [];
    return favs.includes(prestadorId);
  }
}

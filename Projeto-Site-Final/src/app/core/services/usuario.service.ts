import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Usuario } from '../models/types';
import { MOCK_USUARIOS } from '../data/mock-data';
import { getLocalStorage } from '../utils/storage';
import { StorageKeys } from '../utils/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private favoritos$ = new BehaviorSubject<Map<string, string[]>>(new Map());

  constructor() {
    this.loadFavoritos();
  }

  private getUsuarios(): Usuario[] {
    const data = getLocalStorage()?.getItem(StorageKeys.USUARIOS);
    return data ? JSON.parse(data) : MOCK_USUARIOS;
  }

  private saveUsuarios(usuarios: Usuario[]) {
    getLocalStorage()?.setItem(StorageKeys.USUARIOS, JSON.stringify(usuarios));
  }

  private loadFavoritos() {
    const data = getLocalStorage()?.getItem(StorageKeys.FAVORITOS);
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
    getLocalStorage()?.setItem(StorageKeys.FAVORITOS, JSON.stringify(favObj));
  }

  getById(id: string): Observable<Usuario | undefined> {
    return of(this.getUsuarios().find(u => u.id === id));
  }

  updateProfile(user: Usuario): Observable<void> {
    const usuarios = this.getUsuarios();
    const index = usuarios.findIndex(u => u.id === user.id);
    if (index >= 0) {
      usuarios[index] = { ...usuarios[index], ...user };
      this.saveUsuarios(usuarios);
      return of(undefined);
    }
    return throwError(() => new Error('Usuário não encontrado'));
  }

  getFavorites(usuarioId: string): Observable<string[]> {
    return of(this.favoritos$.value.get(usuarioId) || []);
  }

  toggleFavorite(usuarioId: string, prestadorId: string): Observable<void> {
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

    return of(undefined);
  }

  isFavorite(usuarioId: string, prestadorId: string): boolean {
    const favs = this.favoritos$.value.get(usuarioId) || [];
    return favs.includes(prestadorId);
  }
}

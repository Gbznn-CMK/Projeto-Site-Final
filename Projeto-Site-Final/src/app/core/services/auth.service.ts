import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Usuario, TipoUsuario, LoginRequest, CadastroRequest, AuthResponse } from '../models/types';
import { MOCK_USUARIOS } from '../data/mock-data';
import { getLocalStorage } from '../utils/storage';
import { StorageKeys } from '../utils/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<Usuario | null>(null);
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    const token = this.getToken();
    if (!token) return;

    try {
      const payload = token.split('.')[1];
      const userId = JSON.parse(atob(payload)).sub;
      const user = this.getUsuarios().find(usuario => usuario.id === userId);

      if (user) {
        this.currentUser$.next(user);
        this.isAuthenticated$.next(true);
      }
    } catch {
      getLocalStorage()?.removeItem(StorageKeys.TOKEN);
    }
  }

  private getUsuarios(): Usuario[] {
    const data = getLocalStorage()?.getItem(StorageKeys.USUARIOS);
    return data ? JSON.parse(data) : MOCK_USUARIOS;
  }

  private saveUsuarios(usuarios: Usuario[]) {
    getLocalStorage()?.setItem(StorageKeys.USUARIOS, JSON.stringify(usuarios));
  }

  private getToken(): string | null {
    return getLocalStorage()?.getItem(StorageKeys.TOKEN) ?? null;
  }

  private setToken(token: string) {
    getLocalStorage()?.setItem(StorageKeys.TOKEN, token);
  }

  private generateToken(userId: string): string {
    // Mock JWT token: header.payload.signature
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: userId, iat: Date.now() }));
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const usuarios = this.getUsuarios();
    const user = usuarios.find(u => u.email === email);

    if (!user) {
      return throwError(() => new Error('Email ou senha inválidos'));
    }

    const token = this.generateToken(user.id);
    this.setToken(token);
    this.currentUser$.next(user);
    this.isAuthenticated$.next(true);
    return of({ usuario: user, token });
  }

  signup(request: CadastroRequest): Observable<AuthResponse> {
    const usuarios = this.getUsuarios();

    // Check if email already exists
    if (usuarios.some(u => u.email === request.email)) {
      return throwError(() => new Error('Email já cadastrado'));
    }

    // Create new user
    const newUser: Usuario = {
      id: `user-${Date.now()}`,
      nome: request.nome,
      email: request.email,
      telefone: request.telefone,
      tipo: request.tipo,
      dataCadastro: new Date().toISOString()
    };

    usuarios.push(newUser);
    this.saveUsuarios(usuarios);

    // Login automatically
    const token = this.generateToken(newUser.id);
    this.setToken(token);
    this.currentUser$.next(newUser);
    this.isAuthenticated$.next(true);

    return of({ usuario: newUser, token });
  }

  logout(): void {
    getLocalStorage()?.removeItem(StorageKeys.TOKEN);
    this.currentUser$.next(null);
    this.isAuthenticated$.next(false);
  }

  getCurrentUser(): Observable<Usuario | null> {
    return this.currentUser$.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  getUserRole(): TipoUsuario | null {
    return this.currentUser$.value?.tipo || null;
  }

  isUserType(type: TipoUsuario): boolean {
    return this.currentUser$.value?.tipo === type;
  }
}

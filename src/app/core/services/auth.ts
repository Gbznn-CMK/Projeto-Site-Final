import { Injectable, signal } from '@angular/core';
import { UserType } from '../models/user';

export interface User {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: UserType;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usersKey = 'nahora-users';
  private readonly sessionKey = 'nahora-session';
  readonly currentUser = signal<User | null>(this.readSession());

  register(user: User): boolean {
    const users = this.readUsers();
    const normalizedUser = this.normalizeUser(user);
    if (users.some((item) => this.normalizeEmail(item.email) === normalizedUser.email)) {
      return false;
    }
    users.push(normalizedUser);
    this.writeUsers(users);
    this.currentUser.set(normalizedUser);
    this.writeSession(normalizedUser);
    return true;
  }

  login(email: string, senha: string): boolean {
    const normalizedEmail = this.normalizeEmail(email);
    const user = this.readUsers().find(
      (item) => this.normalizeEmail(item.email) === normalizedEmail && item.senha === senha,
    );
    if (!user) {
      return false;
    }
    this.currentUser.set(user);
    this.writeSession(user);
    return true;
  }

  logout(): void {
    this.currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.sessionKey);
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  private readUsers(): User[] {
    return this.read<User[]>(this.usersKey, []);
  }

  private writeUsers(users: User[]): void {
    this.write(this.usersKey, users);
  }

  private readSession(): User | null {
    return this.read<User | null>(this.sessionKey, null);
  }

  private writeSession(user: User): void {
    this.write(this.sessionKey, user);
  }

  private normalizeUser(user: User): User {
    return {
      ...user,
      nome: user.nome.trim(),
      email: this.normalizeEmail(user.email),
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
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

import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('registers, authenticates, and logs out a user', () => {
    const user = {
      nome: 'Ana',
      email: 'ana@example.com',
      senha: '12345678',
      tipoUsuario: 'cliente' as const,
    };

    expect(service.register(user)).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.login(user.email, user.senha)).toBe(true);
    expect(service.currentUser()?.email).toBe(user.email);
  });

  it('rejects duplicate users and invalid credentials', () => {
    const user = {
      nome: 'Ana',
      email: 'ana@example.com',
      senha: '12345678',
      tipoUsuario: 'cliente' as const,
    };
    service.register(user);
    expect(service.register(user)).toBe(false);
    service.logout();
    expect(service.login(user.email, 'wrongpass')).toBe(false);
  });
});

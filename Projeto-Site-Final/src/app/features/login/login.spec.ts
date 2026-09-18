import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login';
import { AuthService } from '../../core/services/auth';
import { Component } from '@angular/core';

@Component({ template: '' })
class TestHomeComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([{ path: 'home-cliente', component: TestHomeComponent }])],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('shows validation errors for an invalid form', () => {
    component.onSubmit();
    expect(component.loginForm.invalid).toBe(true);
    expect(component.loginMessage).toBe('');
  });

  it('logs in a registered user', () => {
    TestBed.inject(AuthService).register({
      nome: 'Ana',
      email: 'ana@example.com',
      senha: '12345678',
      tipoUsuario: 'cliente',
    });
    TestBed.inject(AuthService).logout();
    component.loginForm.setValue({ email: 'ana@example.com', senha: '12345678' });
    component.onSubmit();
    expect(component.loginMessage).toContain('sucesso');
  });
});

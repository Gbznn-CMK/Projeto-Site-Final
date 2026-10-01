import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoginComponent } from './login';
import { AuthService } from '../../core/services/auth.service';
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

  it('authenticates a registered user', async () => {
    const auth = TestBed.inject(AuthService);
    await firstValueFrom(auth.signup({
      nome: 'Ana',
      email: 'login-test@example.com',
      password: '12345678',
      telefone: '',
      tipo: 'cliente',
    }));
    auth.logout();

    const response = await firstValueFrom(auth.login('login-test@example.com', '12345678'));
    expect(response.usuario.email).toBe('login-test@example.com');
  });
});

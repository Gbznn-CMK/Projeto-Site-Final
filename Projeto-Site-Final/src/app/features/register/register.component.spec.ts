import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../core/services/auth.service';
import { Component } from '@angular/core';

@Component({ template: '' })
class TestHomeComponent {}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideRouter([{ path: 'home-cliente', component: TestHomeComponent }])],
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('requires matching passwords and a user type', () => {
    component.registerForm.setValue({
      tipoUsuario: 'cliente',
      nome: 'Ana',
      email: 'cadastro-test@example.com',
      senha: '12345678',
      confirmarSenha: '87654321',
    });
    expect(component.registerForm.hasError('passwordsMismatch')).toBe(true);
  });

  it('does not show a mismatch while the confirmation is empty', () => {
    component.selectUserType('cliente');
    component.registerForm.patchValue({
      nome: 'Ana',
      email: 'cadastro-test@example.com',
      senha: '12345678',
    });

    expect(component.registerForm.hasError('passwordsMismatch')).toBe(false);
  });

  it('registers a valid account', async () => {
    const response = await firstValueFrom(
      TestBed.inject(AuthService).signup({
        nome: 'Ana',
        email: 'cadastro-test@example.com',
        password: '12345678',
        telefone: '',
        tipo: 'cliente',
      }),
    );

    expect(response.usuario.email).toBe('cadastro-test@example.com');
  });
});

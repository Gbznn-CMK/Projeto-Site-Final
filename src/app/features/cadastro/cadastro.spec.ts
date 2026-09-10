import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CadastroComponent } from './cadastro';
import { Component } from '@angular/core';

@Component({ template: '' })
class TestHomeComponent {}

describe('CadastroComponent', () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CadastroComponent],
      providers: [provideRouter([{ path: 'home-cliente', component: TestHomeComponent }])],
    }).compileComponents();
    fixture = TestBed.createComponent(CadastroComponent);
    component = fixture.componentInstance;
  });

  it('requires matching passwords and a user type', () => {
    component.registerForm.setValue({
      tipoUsuario: 'cliente',
      nome: 'Ana',
      email: 'ana@example.com',
      senha: '12345678',
      confirmarSenha: '87654321',
    });
    expect(component.registerForm.hasError('passwordsMismatch')).toBe(true);
  });

  it('does not show a mismatch while the confirmation is empty', () => {
    component.selectUserType('cliente');
    component.registerForm.patchValue({
      nome: 'Ana',
      email: 'ana@example.com',
      senha: '12345678',
    });

    expect(component.registerForm.hasError('passwordsMismatch')).toBe(false);
  });

  it('registers a valid account', () => {
    component.selectUserType('cliente');
    component.registerForm.patchValue({
      nome: 'Ana',
      email: 'ana@example.com',
      senha: '12345678',
      confirmarSenha: '12345678',
    });
    component.onSubmit();
    expect(component.registerMessage).toContain('sucesso');
  });
});

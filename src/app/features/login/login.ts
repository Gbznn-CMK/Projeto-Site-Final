import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  showPassword = false;
  loginMessage = '';
  readonly loginForm = new FormBuilder().nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginMessage = '';
      return;
    }

    const { email, senha } = this.loginForm.getRawValue();
    if (!this.auth.login(email, senha)) {
      this.loginMessage = 'Email ou senha inválidos.';
      return;
    }

    this.loginMessage = 'Login realizado com sucesso!';
    const destination = this.auth.currentUser()?.tipoUsuario === 'prestador'
      ? '/home-prestador'
      : '/home-cliente';
    void this.router.navigate([destination]);
  }

  isInvalid(field: 'email' | 'senha'): boolean {
    const control = this.loginForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}

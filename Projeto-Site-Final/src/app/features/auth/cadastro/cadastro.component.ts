import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TipoUsuario } from '../../../core/models/types';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [NgIf, FormsModule, RouterLink],
  template: `
    <main class="signup-page">
      <section class="signup-panel">
        <a class="brand-mark" routerLink="/login">NaHora Serv</a>
        <p class="eyebrow">Comece agora</p>
        <h1>Crie sua conta</h1>
        <p class="intro">Escolha como você quer usar a plataforma.</p>

        <form (ngSubmit)="signup()" #signupForm="ngForm" novalidate>
          <label class="field"><span>Nome completo</span><input type="text" name="nome" [(ngModel)]="nome" required autocomplete="name"></label>
          <label class="field"><span>E-mail</span><input type="email" name="email" [(ngModel)]="email" required autocomplete="email"></label>
          <label class="field"><span>Telefone</span><input type="tel" name="telefone" [(ngModel)]="telefone" required autocomplete="tel"></label>
          <label class="field"><span>Senha</span><input type="password" name="password" [(ngModel)]="password" required minlength="8" autocomplete="new-password"></label>
          <fieldset class="account-type">
            <legend>Tipo de conta</legend>
            <label><input type="radio" name="tipo" value="cliente" [(ngModel)]="tipo"> Cliente</label>
            <label><input type="radio" name="tipo" value="prestador" [(ngModel)]="tipo"> Prestador</label>
          </fieldset>
          <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>
          <button class="submit-button" type="submit" [disabled]="loading || signupForm.invalid">{{ loading ? 'Criando conta...' : 'Criar conta' }}</button>
        </form>
        <p class="login-link">Já tem uma conta? <a routerLink="/login">Entrar</a></p>
      </section>
    </main>
  `,
  styles: [`
    .signup-page { min-height: 100vh; display: grid; place-items: center; padding: var(--space-lg); background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)); }
    .signup-panel { width: min(100%, 480px); padding: var(--space-2xl); background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); }
    .brand-mark { display: inline-block; color: var(--color-primary); font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-2xl); }
    .eyebrow { color: var(--color-success-dark); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); margin: 0 0 var(--space-xs); text-transform: uppercase; letter-spacing: 0.08em; }
    h1 { margin: 0 0 var(--space-sm); } .intro { color: var(--color-neutral-600); margin-bottom: var(--space-xl); }
    form { display: grid; gap: var(--space-lg); } .field { display: grid; gap: var(--space-xs); } .field span, legend { color: var(--color-neutral-800); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); }
    .account-type { display: flex; gap: var(--space-lg); border: 0; padding: 0; } .account-type legend { width: 100%; margin-bottom: var(--space-xs); } .account-type label { color: var(--color-neutral-700); font-size: var(--font-size-sm); }
    .submit-button { min-height: 48px; border: 0; border-radius: var(--radius-md); background: var(--color-primary); color: white; font-weight: var(--font-weight-bold); cursor: pointer; }
    .submit-button:hover:not(:disabled) { background: var(--color-primary-light); } .submit-button:disabled { cursor: not-allowed; opacity: 0.6; }
    .error-message { color: var(--color-danger-dark); background: #fff1f0; border-radius: var(--radius-sm); padding: var(--space-sm) var(--space-md); margin: 0; font-size: var(--font-size-sm); }
    .login-link { margin: var(--space-xl) 0 0; text-align: center; color: var(--color-neutral-600); font-size: var(--font-size-sm); }
    @media (max-width: 480px) { .signup-panel { padding: var(--space-xl) var(--space-lg); } }
  `]
})
export class CadastroComponent {
  nome = '';
  email = '';
  telefone = '';
  password = '';
  tipo: TipoUsuario = 'cliente';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    this.loading = true;
    this.errorMessage = '';
    this.authService.signup({
      nome: this.nome.trim(),
      email: this.email.trim(),
      telefone: this.telefone.trim(),
      password: this.password,
      tipo: this.tipo
    }).subscribe({
      next: () => this.router.navigate(['/inicio']),
      error: error => {
        this.errorMessage = error.message || 'Não foi possível criar sua conta.';
        this.loading = false;
      }
    });
  }
}

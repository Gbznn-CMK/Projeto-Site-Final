import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="login-page">
      <aside class="login-aside">
        <div class="brand-lockup">
          <span class="brand-symbol" aria-hidden="true">✓</span>
          <span>NaHora <strong>Serv</strong></span>
        </div>
        <div class="aside-copy">
          <p class="eyebrow">Tudo no seu tempo</p>
          <h2>Serviços que cabem na sua rotina.</h2>
          <p>Encontre profissionais confiáveis e organize cada atendimento em um só lugar.</p>
        </div>
        <div class="aside-orbit" aria-hidden="true"></div>
      </aside>

      <section class="login-panel">
        <div class="mobile-brand brand-lockup">
          <span class="brand-symbol" aria-hidden="true">✓</span>
          <span>NaHora <strong>Serv</strong></span>
        </div>
        <p class="eyebrow">Acesso à sua conta</p>
        <h1>Bem-vindo de volta</h1>
        <p class="intro">Entre para encontrar prestadores e acompanhar seus agendamentos.</p>

        <form (ngSubmit)="login()" #loginForm="ngForm" novalidate>
          <label class="field">
            <span>E-mail</span>
            <input
              type="email"
              name="email"
              [(ngModel)]="email"
              required
              autocomplete="email"
              placeholder="voce@email.com"
            >
          </label>

          <label class="field">
            <span>Senha</span>
            <input
              type="password"
              name="password"
              [(ngModel)]="password"
              required
              autocomplete="current-password"
              placeholder="Digite sua senha"
            >
          </label>

          <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>

          <button class="submit-button" type="submit" [disabled]="loading || loginForm.invalid">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <p class="signup-link">Ainda não tem uma conta? <a routerLink="/cadastro">Cadastre-se</a></p>
      </section>
    </main>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: minmax(280px, 34%) 1fr;
      background: #fff;
    }

    .login-aside {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 100vh;
      padding: clamp(2rem, 5vw, 5rem);
      overflow: hidden;
      color: white;
      background: var(--color-primary);
    }

    .brand-lockup {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      color: inherit;
      font-size: 1.2rem;
      letter-spacing: 0.01em;
    }

    .brand-lockup strong { font-weight: 700; }

    .brand-symbol {
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border: 2px solid currentColor;
      border-radius: 0.6rem 0.6rem 0.6rem 0.15rem;
      font-size: 1.35rem;
      font-weight: 700;
      transform: rotate(-8deg);
    }

    .aside-copy {
      position: relative;
      z-index: 1;
      max-width: 290px;
      margin-top: auto;
      margin-bottom: 16vh;
    }

    .aside-copy h2 {
      margin: 0 0 var(--space-md);
      color: white;
      font-family: var(--font-family-display);
      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 400;
      line-height: 1.05;
    }

    .aside-copy p:last-child { color: rgba(255, 255, 255, 0.75); }

    .aside-orbit {
      position: absolute;
      right: -18%;
      bottom: 8%;
      width: 70%;
      aspect-ratio: 1;
      border: 2px solid rgba(255, 255, 255, 0.14);
      border-radius: 50%;
      transform: rotate(-24deg);
    }

    .aside-orbit::after {
      content: '';
      position: absolute;
      inset: 12%;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 50%;
    }

    .login-panel {
      align-self: center;
      width: min(100%, 500px);
      margin: 0 auto;
      padding: clamp(2rem, 5vw, 5rem);
    }

    .mobile-brand { display: none; color: var(--color-primary); margin-bottom: 3rem; }

    .eyebrow {
      color: var(--color-primary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      margin: 0 0 var(--space-sm);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    h1 {
      margin: 0 0 var(--space-md);
      color: var(--color-neutral-900);
      font-family: var(--font-family-display);
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 400;
    }

    .intro {
      color: var(--color-neutral-600);
      margin: 0 0 2.5rem;
      color: var(--color-neutral-600);
    }

    form {
      display: grid;
      gap: var(--space-xl);
    }

    .field {
      display: grid;
      gap: var(--space-xs);
    }

    .field span {
      color: var(--color-neutral-800);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      letter-spacing: 0.01em;
    }

    .field input {
      width: 100%;
      min-height: 52px;
      border: 1px solid var(--color-neutral-300);
      border-radius: var(--radius-md);
      background: var(--color-neutral-50);
    }

    .submit-button {
      min-height: 48px;
      border: 0;
      border-radius: var(--radius-md);
      background: var(--color-success);
      color: white;
      font-weight: var(--font-weight-bold);
      cursor: pointer;
    }

    .submit-button:hover:not(:disabled) {
      background: var(--color-success-dark);
    }

    .submit-button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .error-message {
      color: var(--color-danger-dark);
      background: #fff1f0;
      border-radius: var(--radius-sm);
      padding: var(--space-sm) var(--space-md);
      margin: 0;
      font-size: var(--font-size-sm);
    }

    .signup-link {
      margin: var(--space-xl) 0 0;
      text-align: center;
      color: var(--color-neutral-600);
      font-size: var(--font-size-sm);
    }

    .signup-link a { color: var(--color-primary); font-weight: var(--font-weight-bold); }

    @media (max-width: 700px) {
      .login-page { display: block; }
      .login-aside { display: none; }
      .mobile-brand { display: flex; }
      .login-panel {
        min-height: 100vh;
        padding: 2rem var(--space-lg);
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  returnUrl = '/inicio';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/inicio';
  }

  login() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl);
      },
      error: error => {
        this.errorMessage = error.message || 'Não foi possível entrar.';
        this.loading = false;
      }
    });
  }
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="not-found">
      <p class="eyebrow">Erro 404</p>
      <h1>Página não encontrada</h1>
      <p>O endereço acessado não existe ou foi removido.</p>
      <a routerLink="/login">Voltar para o login</a>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .not-found {
      display: grid;
      place-content: center;
      min-height: 100vh;
      padding: 2rem;
      text-align: center;
      color: var(--color-neutral-900, #172033);
      background: var(--color-neutral-50, #f7f8fa);
    }
    .eyebrow {
      margin: 0 0 .5rem;
      color: var(--color-primary, #2f6fed);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    h1 { margin: 0 0 .75rem; }
    p:not(.eyebrow) { margin: 0 0 1.5rem; color: var(--color-neutral-600, #5d6675); }
    a { color: var(--color-primary, #2f6fed); font-weight: 700; }
  `],
})
export class NotFoundComponent {}

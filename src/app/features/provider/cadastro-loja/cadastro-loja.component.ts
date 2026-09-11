import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CATEGORIAS_SERVICOS, Prestador, Usuario } from '../../../core/models/types';
import { AuthService } from '../../../core/services/auth.service';
import { PrestadorService } from '../../../core/services/prestador.service';

@Component({
  selector: 'app-cadastro-loja',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="store-page">
      <a class="back-link" routerLink="/painel">Voltar para o painel</a>
      <header class="page-heading">
        <p class="eyebrow">Área do prestador</p>
        <h1>{{ existingPrestador ? 'Atualizar loja' : 'Cadastrar loja' }}</h1>
        <p>Apresente seu negócio para clientes que procuram serviços na sua região.</p>
      </header>

      <form class="store-form" (ngSubmit)="save()" #storeForm="ngForm">
        <label class="field">
          <span>Nome do estabelecimento</span>
          <input name="nomeEstabelecimento" [(ngModel)]="draft.nomeEstabelecimento" required minlength="3">
        </label>
        <label class="field">
          <span>Categoria</span>
          <select name="categoria" [(ngModel)]="draft.categoria" required>
            <option *ngFor="let categoria of categorias" [value]="categoria">{{ categoria }}</option>
          </select>
        </label>
        <label class="field">
          <span>Endereço</span>
          <input name="endereco" [(ngModel)]="draft.endereco" required minlength="5">
        </label>
        <label class="field">
          <span>Horário de funcionamento</span>
          <input name="horarioFuncionamento" [(ngModel)]="draft.horarioFuncionamento" required placeholder="09:00 - 18:00">
        </label>
        <label class="field">
          <span>Descrição</span>
          <textarea name="descricao" [(ngModel)]="draft.descricao" rows="4"></textarea>
        </label>

        <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>
        <div class="form-actions">
          <a class="btn btn-secondary" routerLink="/painel">Cancelar</a>
          <button class="btn btn-primary" type="submit" [disabled]="storeForm.invalid || saving">
            {{ saving ? 'Salvando...' : 'Salvar loja' }}
          </button>
        </div>
      </form>
    </section>
  `,
  styles: [`
    .store-page {
      max-width: 760px;
      margin: 0 auto;
    }

    .back-link {
      display: inline-block;
      margin-bottom: var(--space-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
    }

    .page-heading {
      margin-bottom: var(--space-xl);
    }

    .eyebrow {
      color: var(--color-success-dark);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      margin: 0 0 var(--space-xs);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    h1 {
      margin: 0 0 var(--space-sm);
    }

    .page-heading p:last-child {
      color: var(--color-neutral-600);
      margin: 0;
    }

    .store-form {
      display: grid;
      gap: var(--space-lg);
      padding: var(--space-xl);
      background: white;
      border: 1px solid var(--color-neutral-200);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    .field {
      display: grid;
      gap: var(--space-xs);
    }

    .field span {
      color: var(--color-neutral-700);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
    }

    .form-actions {
      display: flex;
      justify-content: end;
      gap: var(--space-md);
    }

    .btn {
      display: inline-block;
      padding: var(--space-sm) var(--space-lg);
      border: 0;
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-bold);
      text-decoration: none;
    }

    .btn-primary {
      color: white;
      background: var(--color-primary);
    }

    .btn-secondary {
      color: var(--color-neutral-900);
      background: var(--color-neutral-200);
    }

    .error-message {
      margin: 0;
      padding: var(--space-md);
      color: var(--color-danger-dark);
      background: #fff1f0;
      border-radius: var(--radius-md);
    }

    @media (max-width: 600px) {
      .store-form {
        padding: var(--space-lg);
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .form-actions .btn {
        text-align: center;
      }
    }
  `]
})
export class CadastroLojaComponent implements OnInit {
  readonly categorias = CATEGORIAS_SERVICOS;
  draft: Partial<Prestador> = {
    nomeEstabelecimento: '',
    categoria: CATEGORIAS_SERVICOS[0],
    endereco: '',
    horarioFuncionamento: '',
    descricao: ''
  };
  existingPrestador?: Prestador;
  saving = false;
  errorMessage = '';
  private user?: Usuario;

  constructor(
    private authService: AuthService,
    private prestadorService: PrestadorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user ?? undefined;
      if (!user) return;

      this.prestadorService.getByUsuarioId(user.id).subscribe(prestador => {
        this.existingPrestador = prestador;
        if (prestador) this.draft = { ...prestador };
      });
    });
  }

  save() {
    if (!this.user || !this.draft.nomeEstabelecimento || !this.draft.categoria || !this.draft.endereco || !this.draft.horarioFuncionamento) {
      this.errorMessage = 'Preencha os campos obrigatórios.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    const prestador: Prestador = {
      id: this.existingPrestador?.id ?? '',
      usuarioId: this.user.id,
      nomeEstabelecimento: this.draft.nomeEstabelecimento.trim(),
      categoria: this.draft.categoria,
      endereco: this.draft.endereco.trim(),
      horarioFuncionamento: this.draft.horarioFuncionamento.trim(),
      descricao: this.draft.descricao?.trim()
    };
    const request = this.existingPrestador
      ? this.prestadorService.update(prestador)
      : this.prestadorService.create(prestador);

    request.subscribe({
      next: () => this.router.navigate(['/meus-servicos']),
      error: () => {
        this.errorMessage = 'Não foi possível salvar a loja.';
        this.saving = false;
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/types';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="settings-page"><header class="page-heading"><div><p class="eyebrow">Sua conta</p><h1>Configurações</h1><p class="subtitle">Mantenha seus dados pessoais atualizados.</p></div></header>
      <form class="settings-card" (ngSubmit)="save()" #settingsForm="ngForm"><h2>Dados pessoais</h2><label class="field"><span>Nome completo</span><input name="nome" [(ngModel)]="draft.nome" required></label><label class="field"><span>E-mail</span><input type="email" name="email" [(ngModel)]="draft.email" required></label><label class="field"><span>Telefone</span><input type="tel" name="telefone" [(ngModel)]="draft.telefone" required></label><div class="account-info"><span>Tipo de conta</span><strong>{{ getTypeLabel() }}</strong></div><p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p><p class="success-message" *ngIf="successMessage">{{ successMessage }}</p><div class="form-actions"><button class="btn btn-primary" type="submit" [disabled]="settingsForm.invalid || saving">{{ saving ? 'Salvando...' : 'Salvar alterações' }}</button></div></form>
    </section>
  `,
  styles: [`
    .settings-page { max-width: 760px; margin: 0 auto; } .page-heading { margin-bottom: var(--space-xl); } .eyebrow { color: var(--color-success-dark); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); margin: 0 0 var(--space-xs); text-transform: uppercase; letter-spacing: 0.08em; } h1, h2 { margin: 0; } .subtitle { color: var(--color-neutral-600); margin: var(--space-xs) 0 0; } .settings-card { display: grid; gap: var(--space-lg); padding: var(--space-xl); background: white; border: 1px solid var(--color-neutral-200); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); } .settings-card h2 { font-size: var(--font-size-xl); } .field { display: grid; gap: var(--space-xs); } .field span, .account-info span { color: var(--color-neutral-700); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); } .account-info { display: flex; justify-content: space-between; padding: var(--space-md); color: var(--color-primary); background: var(--color-neutral-50); border-radius: var(--radius-md); } .btn { padding: var(--space-md) var(--space-lg); color: white; background: var(--color-primary); } .form-actions { display: flex; justify-content: end; } .error-message, .success-message { padding: var(--space-md); border-radius: var(--radius-md); margin: 0; } .error-message { color: var(--color-danger-dark); background: #fff1f0; } .success-message { color: var(--color-success-dark); background: #e8f5e9; } @media (max-width: 600px) { .settings-card { padding: var(--space-lg); } .form-actions, .form-actions .btn { width: 100%; } }
  `]
})
export class ConfiguracoesComponent implements OnInit {
  draft: Partial<Usuario> = {};
  private currentUser?: Usuario;
  saving = false; errorMessage = ''; successMessage = '';

  constructor(private authService: AuthService, private usuarioService: UsuarioService) {}

  ngOnInit() { this.authService.getCurrentUser().subscribe(user => { this.currentUser = user || undefined; if (user) this.draft = { ...user }; }); }
  getTypeLabel() { return this.currentUser?.tipo === 'prestador' ? 'Prestador' : this.currentUser?.tipo === 'admin' ? 'Administrador' : 'Cliente'; }
  save() { if (!this.currentUser || !this.draft.nome || !this.draft.email || !this.draft.telefone) return; this.saving = true; this.errorMessage = ''; this.usuarioService.updateProfile({ ...this.currentUser, nome: this.draft.nome.trim(), email: this.draft.email.trim(), telefone: this.draft.telefone.trim() }).subscribe({ next: () => { this.currentUser = { ...this.currentUser!, ...this.draft } as Usuario; this.successMessage = 'Dados atualizados com sucesso.'; this.saving = false; }, error: error => { this.errorMessage = error.message || 'Não foi possível salvar as alterações.'; this.saving = false; } }); }
}

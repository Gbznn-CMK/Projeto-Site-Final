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
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.css',
})
export class ConfiguracoesComponent implements OnInit {
  draft: Partial<Usuario> = {};
  private currentUser?: Usuario;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user || undefined;
      if (user) this.draft = { ...user };
    });
  }
  getTypeLabel() {
    return this.currentUser?.tipo === 'prestador'
      ? 'Prestador'
      : this.currentUser?.tipo === 'admin'
        ? 'Administrador'
        : 'Cliente';
  }
  save() {
    if (!this.currentUser || !this.draft.nome || !this.draft.email || !this.draft.telefone) return;
    this.saving = true;
    this.errorMessage = '';
    this.usuarioService
      .updateProfile({
        ...this.currentUser,
        nome: this.draft.nome.trim(),
        email: this.draft.email.trim(),
        telefone: this.draft.telefone.trim(),
      })
      .subscribe({
        next: () => {
          this.currentUser = { ...this.currentUser!, ...this.draft } as Usuario;
          this.successMessage = 'Dados atualizados com sucesso.';
          this.saving = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Não foi possível salvar as alterações.';
          this.saving = false;
        },
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Usuario } from '../../core/models/types';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  draft: Partial<Usuario> = {};
  private currentUser?: Usuario;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private usuarioService: UserService,
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/types';

export interface UserProfile {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  cpf: string;
  foto: string;
}

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.css',
})
export class ClientProfileComponent implements OnInit {
  modalAberta = false;
  usuario: UserProfile = {
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    cpf: '',
    foto: '',
  };

  dadosEdicao: UserProfile = { ...this.usuario };

  salvando = false;
  mensagem = '';

  constructor(private readonly auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) this.usuario = this.toProfile(user);
  }

  // Getters do perfil
  get userName(): string {
    return [this.usuario.nome, this.usuario.sobrenome].filter(Boolean).join(' ') || 'Usuário';
  }

  selecionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.mensagem = 'Selecione um arquivo de imagem.';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.mensagem = 'A foto deve ter no máximo 2 MB.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.dadosEdicao.foto = reader.result;
        this.mensagem = '';
      }
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  // Métodos do Modal de Edição
  abrirModal(): void {
    this.dadosEdicao = { ...this.usuario };
    this.modalAberta = true;
  }

  fecharModal(): void {
    this.modalAberta = false;
  }

  formatarCPF(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    this.dadosEdicao.cpf = value;
  }

  formatarTelefone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');

    this.dadosEdicao.telefone = value;
  }

  salvarPerfil(): void {
    const nome = [this.dadosEdicao.nome.trim(), this.dadosEdicao.sobrenome.trim()]
      .filter(Boolean)
      .join(' ');
    if (!nome || !this.dadosEdicao.email.trim()) {
      this.mensagem = 'Nome e e-mail são obrigatórios.';
      return;
    }

    this.salvando = true;
    this.mensagem = '';
    this.auth
      .updateProfile({
        nome,
        sobrenome: this.dadosEdicao.sobrenome.trim(),
        email: this.dadosEdicao.email.trim(),
        telefone: this.dadosEdicao.telefone.trim(),
        cpf: this.dadosEdicao.cpf.trim(),
        foto: this.dadosEdicao.foto,
      })
      .subscribe({
        next: (user) => {
          this.usuario = this.toProfile(user);
          this.salvando = false;
          this.fecharModal();
        },
        error: (error: Error) => {
          this.salvando = false;
          this.mensagem = error.message || 'Não foi possível salvar o perfil.';
        },
      });
  }

  private toProfile(user: Usuario): UserProfile {
    const nameParts = user.nome.trim().split(/\s+/);
    return {
      nome: nameParts.shift() || '',
      sobrenome: user.sobrenome || nameParts.join(' '),
      email: user.email,
      telefone: user.telefone,
      cpf: user.cpf || '',
      foto: user.foto || '',
    };
  }
}

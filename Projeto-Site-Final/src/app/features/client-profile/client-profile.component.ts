import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export interface UserProfile {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  cpf: string;
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
  isBrowser: boolean;

  usuario: UserProfile = {
    nome: 'GBznnn',
    sobrenome: '',
    email: 'gbznnn@exemplo.com',
    telefone: '(21) 98168-6514',
    cpf: '',
  };

  dadosEdicao: UserProfile = { ...this.usuario };

  constructor(
    private readonly auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const savedProfile = localStorage.getItem('user_profile_data');
      if (savedProfile) {
        this.usuario = JSON.parse(savedProfile);
      }
    }
  }

  // Getters do perfil
  get userName(): string {
    return this.auth.currentUser()?.nome || this.usuario.nome || 'Cliente';
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
    this.usuario = { ...this.dadosEdicao };
    if (this.isBrowser) {
      localStorage.setItem('user_profile_data', JSON.stringify(this.usuario));
    }
    this.fecharModal();
  }
}

import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

export interface UserProfile {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  cpf: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './perfil-cliente.html',
  styleUrl: './perfil-cliente.css'
})
export class PerfilComponent implements OnInit {
  modalAberta = false;
  isBrowser: boolean;

  // Variáveis para controle da Sidebar
  collapsed = false;
  mobileExpanded = false;
  profileMenuOpen = false;

  usuario: UserProfile = {
    nome: 'GBznnn',
    sobrenome: '',
    email: 'gbznnn@exemplo.com',
    telefone: '(21) 98168-6514',
    cpf: ''
  };

  dadosEdicao: UserProfile = { ...this.usuario };

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
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

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  // Métodos da Sidebar
  toggleSidebar(): void {
    if (this.isMobile()) {
      this.mobileExpanded = !this.mobileExpanded;
    } else {
      this.collapsed = !this.collapsed;
    }
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  logout(): void {
    this.profileMenuOpen = false;
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  private isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= 860;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isMobile()) {
      this.mobileExpanded = false;
    }
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
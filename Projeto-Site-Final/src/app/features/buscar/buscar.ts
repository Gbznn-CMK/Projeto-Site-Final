import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

export interface Prestador {
  id: number;
  nome: string;
  categoria: string;
  avaliacao: number;
  numAvaliacoes: number;
  precoDesde: number;
  foto: string;
  favorito: boolean;
}

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './buscar.html',
  styleUrl: './buscar.css'
})
export class BuscarComponent {
  isBrowser: boolean;

  // ---------- Variáveis da Sidebar ----------
  collapsed = false;
  mobileExpanded = false;
  profileMenuOpen = false;

  // ---------- Variáveis da Busca ----------
  termoBusca = '';
  categoriaSelecionada = 'Todos';
  ordenacao: 'relevancia' | 'avaliacao' | 'menor-preco' | 'maior-preco' = 'relevancia';

  categorias = ['Todos', 'Barbearia', 'Salão de Beleza', 'Manicure', 'Personal Trainer', 'Pet Shop', 'Estética'];

  prestadores: Prestador[] = [
    { id: 1, nome: 'Barbearia Central', categoria: 'Barbearia', avaliacao: 4.8, numAvaliacoes: 132, precoDesde: 35, foto: '/img/barbearia.webp', favorito: false },
    { id: 2, nome: 'Salão da Maria', categoria: 'Salão de Beleza', avaliacao: 4.6, numAvaliacoes: 98, precoDesde: 50, foto: '/img/salao-maria.png', favorito: true },
    { id: 3, nome: 'Studio Unhas & Cia', categoria: 'Manicure', avaliacao: 4.9, numAvaliacoes: 210, precoDesde: 25, foto: '/img/manicure.png', favorito: false },
    { id: 4, nome: 'Fit Pro Personal', categoria: 'Personal Trainer', avaliacao: 4.7, numAvaliacoes: 64, precoDesde: 80, foto: '/img/studio-fit.png', favorito: false },
    { id: 5, nome: 'Pet Amigo', categoria: 'Pet Shop', avaliacao: 4.5, numAvaliacoes: 47, precoDesde: 40, foto: '/img/pet-shop.jpg', favorito: false },
    { id: 6, nome: 'Espaço Bem Estar', categoria: 'Estética', avaliacao: 4.4, numAvaliacoes: 71, precoDesde: 60, foto: '/img/bem-star.jpg', favorito: false },
  ];

  constructor(
    private readonly router: Router,      
    private readonly auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // ---------- Getters da Sidebar ----------
  get userName(): string {
    return this.auth.currentUser()?.nome || 'Cliente';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  // ---------- Métodos da Sidebar ----------
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

  // ---------- Lógica da Busca ----------
  get prestadoresFiltrados(): Prestador[] {
    let lista = this.prestadores.filter(p => {
      const bateCategoria = this.categoriaSelecionada === 'Todos' || p.categoria === this.categoriaSelecionada;
      const bateBusca = p.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
                         p.categoria.toLowerCase().includes(this.termoBusca.toLowerCase());
      return bateCategoria && bateBusca;
    });

    switch (this.ordenacao) {
      case 'avaliacao':
        lista = lista.slice().sort((a, b) => b.avaliacao - a.avaliacao);
        break;
      case 'menor-preco':
        lista = lista.slice().sort((a, b) => a.precoDesde - b.precoDesde);
        break;
      case 'maior-preco':
        lista = lista.slice().sort((a, b) => b.precoDesde - a.precoDesde);
        break;
    }
    return lista;
  }

  selecionarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
  }

  toggleFavorito(prestador: Prestador, event: Event): void {
    event.stopPropagation();
    prestador.favorito = !prestador.favorito;
  }

  limparBusca(): void {
    this.termoBusca = '';
    this.categoriaSelecionada = 'Todos';
  }

  onImagemErro(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = 'https://placehold.co/400x300/e8ecf3/999999?text=Sem+foto';
  }
}

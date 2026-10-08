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
  latitude: number;
  longitude: number;
  distanciaKm?: number;
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
  ordenacaoLocalizacao = false;
  locationMessage = '';
  userLocation?: { latitude: number; longitude: number };

  categorias = ['Todos', 'Barbearia', 'Salão de Beleza', 'Manicure', 'Personal Trainer', 'Pet Shop', 'Estética'];

  prestadores: Prestador[] = [
    { id: 1, nome: 'Barbearia Central', categoria: 'Barbearia', avaliacao: 4.8, numAvaliacoes: 132, precoDesde: 35, foto: '/img/barbearia.webp', favorito: false, latitude: -22.875, longitude: -43.463 },
    { id: 2, nome: 'Salão da Maria', categoria: 'Salão de Beleza', avaliacao: 4.6, numAvaliacoes: 98, precoDesde: 50, foto: '/img/salao-maria.png', favorito: true, latitude: -23.561, longitude: -46.656 },
    { id: 3, nome: 'Studio Unhas & Cia', categoria: 'Manicure', avaliacao: 4.9, numAvaliacoes: 210, precoDesde: 25, foto: '/img/manicure.png', favorito: false, latitude: -22.906, longitude: -43.172 },
    { id: 4, nome: 'Fit Pro Personal', categoria: 'Personal Trainer', avaliacao: 4.7, numAvaliacoes: 64, precoDesde: 80, foto: '/img/studio-fit.png', favorito: false, latitude: -22.883, longitude: -43.103 },
    { id: 5, nome: 'Pet Amigo', categoria: 'Pet Shop', avaliacao: 4.5, numAvaliacoes: 47, precoDesde: 40, foto: '/img/pet-shop.jpg', favorito: false, latitude: -22.906, longitude: -43.177 },
    { id: 6, nome: 'Espaço Bem Estar', categoria: 'Estética', avaliacao: 4.4, numAvaliacoes: 71, precoDesde: 60, foto: '/img/bem-star.jpg', favorito: false, latitude: -25.429, longitude: -49.271 },
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
    if (this.ordenacaoLocalizacao && this.userLocation) {
      lista = lista.slice().sort((a, b) => (a.distanciaKm ?? Infinity) - (b.distanciaKm ?? Infinity));
    }
    return lista;
  }

  buscarProximos(): void {
    if (!navigator.geolocation) {
      this.locationMessage = 'Seu navegador não oferece localização.';
      return;
    }
    this.locationMessage = 'Obtendo sua localização...';
    navigator.geolocation.getCurrentPosition(
      position => {
        this.userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.prestadores.forEach(prestador => {
          prestador.distanciaKm = this.distanceKm(
            this.userLocation!.latitude,
            this.userLocation!.longitude,
            prestador.latitude,
            prestador.longitude,
          );
        });
        this.ordenacaoLocalizacao = true;
        this.locationMessage = 'Resultados ordenados pela distância estimada.';
      },
      () => this.locationMessage = 'Não foi possível obter sua localização. Verifique a permissão do navegador.',
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

  private distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadius = 6371;
    const latitudeDelta = (lat2 - lat1) * Math.PI / 180;
    const longitudeDelta = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(latitudeDelta / 2) ** 2
      + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(longitudeDelta / 2) ** 2;
    return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

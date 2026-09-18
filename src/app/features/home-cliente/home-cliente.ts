import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { FavoritosService } from '../../services/favoritos';
import { LojaService } from '../../core/services/loja';

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home-cliente.html',
  styleUrl: './home-cliente.css',
})
export class HomeCliente implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly favoritosService: FavoritosService,
  ) {}

  private readonly lojaService = inject(LojaService);

  collapsed = false;
  mobileExpanded = false;
  profileMenuOpen = false;
  searchTerm = '';
  filterMenuOpen = false;
  selectedCategory = '';
  selectedSort = 'relevance';
  onlyFavorites = false;
  favorites = new Set<string>();
  selectedProvider: (typeof this.providers)[number] | null = null;
  notificationsOpen = false;

  ngOnInit(): void {
    for (const loja of this.lojaService.listar()) {
      this.providers.push({
        name: loja.nome,
        id: loja.id,
        image: loja.imagemUrl,
        category: loja.categoria,
        address: loja.endereco,
        hours: loja.horario,
        rating: 'Novo',
        stars: '☆☆☆☆☆',
      });
    }
    this.favoritosService.listarIds().subscribe((ids) => {
      this.favorites = new Set(
        this.providers
          .filter((provider) => ids.includes(provider.id))
          .map((provider) => provider.name),
      );
    });
  }

  readonly providers = [
    {
      name: 'Barbearia Central',
      id: 1,
      image: '/img/barbearia.webp',
      category: 'Barbearia',
      address: 'Rua Belterra 291, Bangu, RJ',
      hours: '09:00–18:00',
      rating: '4.5/5',
      stars: '★★★★☆',
    },
    {
      name: 'Salão da Maria',
      id: 2,
      image: '/img/salao-maria.png',
      category: 'Salão de Beleza',
      address: 'Av. Paulista 1000, São Paulo, SP',
      hours: '09:00–19:00',
      rating: '4.5/5',
      stars: '★★★★☆',
    },
    {
      name: 'Nails & More',
      id: 3,
      image: '/img/manicure.png',
      category: 'Manicure',
      address: 'Rua das Flores 123, Rio de Janeiro, RJ',
      hours: '10:00–18:00',
      rating: '4.7/5',
      stars: '★★★★★',
    },
    {
      name: 'Studio Fit',
      id: 4,
      image: '/img/studio-fit.png',
      category: 'Personal Trainer',
      address: 'Rua Ipiranga 55, Niterói, RJ',
      hours: '06:00–21:00',
      rating: '4.6/5',
      stars: '★★★★☆',
    },
  ];

  get userName(): string {
    return this.auth.currentUser()?.nome || 'Cliente';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  get filteredProviders() {
    const term = this.searchTerm.trim().toLowerCase();

    let results = this.providers.filter((provider) => {
      const matchesSearch = !term ||
        `${provider.name} ${provider.category} ${provider.address}`
          .toLowerCase()
          .includes(term);
      const matchesCategory = !this.selectedCategory ||
        provider.category === this.selectedCategory;
      const matchesFavorites = !this.onlyFavorites ||
        this.favorites.has(provider.name);

      return matchesSearch && matchesCategory && matchesFavorites;
    });

    if (this.selectedSort === 'rating') {
      results = [...results].sort((a, b) =>
        (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0),
      );
    } else if (this.selectedSort === 'name') {
      results = [...results].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR'),
      );
    }

    return results;
  }

  toggleFilterMenu(): void {
    this.filterMenuOpen = !this.filterMenuOpen;
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedSort = 'relevance';
    this.onlyFavorites = false;
  }

  toggleSidebar(): void {
    if (this.isMobile()) {
      this.mobileExpanded = !this.mobileExpanded;
    } else {
      this.collapsed = !this.collapsed;
    }
  }

  toggleFavorite(providerName: string): void {
    const provider = this.providers.find((item) => item.name === providerName);
    if (!provider) {
      return;
    }

    const isFavorite = this.favorites.has(providerName);
    const request = isFavorite
      ? this.favoritosService.desfavoritar(provider.id)
      : this.favoritosService.favoritar(provider.id);

    request.subscribe(() => {
      const nextFavorites = new Set(this.favorites);
      if (isFavorite) {
        nextFavorites.delete(providerName);
      } else {
        nextFavorites.add(providerName);
      }
      this.favorites = nextFavorites;
    });
  }

  isFavorite(providerName: string): boolean {
    return this.favorites.has(providerName);
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  openProviderProfile(provider: (typeof this.providers)[number]): void {
    this.selectedProvider = provider;
  }

  closeProviderProfile(): void {
    this.selectedProvider = null;
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
  }

  logout(): void {
    this.profileMenuOpen = false;
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  closeMobileMenu(): void {
    if (this.isMobile()) {
      this.mobileExpanded = false;
    }
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
}

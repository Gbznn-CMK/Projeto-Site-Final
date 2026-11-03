import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { ProviderService } from '../../core/services/provider.service';
import { Notificacao, NotificationService } from '../../core/services/notification.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.css',
})
export class ClientHome implements OnInit {
  constructor(
    private readonly auth: AuthService,
    private readonly favoritosService: FavoritesService,
    private readonly notificacaoService: NotificationService,
    private readonly usuarioService: UserService,
  ) {}

  private readonly prestadorService = inject(ProviderService);

  searchTerm = '';
  filterMenuOpen = false;
  selectedCategory = '';
  selectedSort = 'relevance';
  onlyFavorites = false;
  favorites = new Set<string>();
  selectedProvider: (typeof this.providers)[number] | null = null;
  notificationsOpen = false;
  notificacoes: Notificacao[] = [];

  ngOnInit(): void {
    this.prestadorService.getAll().subscribe((providers) => {
      for (const provider of providers) {
        if (this.providers.some((item) => item.id === provider.id)) continue;
        this.providers.push({
          name: provider.nomeEstabelecimento,
          id: provider.id,
          image: provider.foto || '/img/barbearia.webp',
          photos: provider.fotos ?? [provider.foto || '/img/barbearia.webp'],
          category: provider.categoria,
          address: provider.endereco,
          hours: provider.horarioFuncionamento,
          rating: 'Novo',
          stars: '☆☆☆☆☆',
        });
      }
    });
    this.favoritosService.listarIds().subscribe((ids) => {
      this.favorites = new Set(
        this.providers
          .filter((provider) => typeof provider.id === 'number' && ids.includes(provider.id))
          .map((provider) => provider.name),
      );
    });
    const userEmail = this.auth.currentUser()?.email;
    if (userEmail) {
      this.usuarioService.getByEmail(userEmail).subscribe((user) => {
        if (!user) return;
        this.notificacaoService.paraUsuario(user.id, 'cliente').subscribe({
          next: (notificacoes) => (this.notificacoes = notificacoes),
        });
      });
    }
  }

  readonly providers: {
    name: string;
    id: string | number;
    image: string;
    category: string;
    address: string;
    hours: string;
    rating: string;
    stars: string;
    photos: string[];
  }[] = [
    {
      name: 'Barbearia Central',
      id: 'prest-1',
      image: '/img/barbearia.webp',
      category: 'Barbearia',
      address: 'Rua Belterra 291, Bangu, RJ',
      hours: '09:00–18:00',
      rating: '4.5/5',
      stars: '★★★★☆',
      photos: ['/img/barbearia.webp'],
    },
    {
      name: 'Salão da Maria',
      id: 'prest-2',
      image: '/img/salao-maria.png',
      category: 'Salão de Beleza',
      address: 'Av. Paulista 1000, São Paulo, SP',
      hours: '09:00–19:00',
      rating: '4.5/5',
      stars: '★★★★☆',
      photos: ['/img/salao-maria.png'],
    },
    {
      name: 'Nails & More',
      id: 'prest-3',
      image: '/img/manicure.png',
      category: 'Manicure',
      address: 'Rua das Flores 123, Rio de Janeiro, RJ',
      hours: '10:00–18:00',
      rating: '4.7/5',
      stars: '★★★★★',
      photos: ['/img/manicure.png'],
    },
    {
      name: 'Tech Fix',
      id: 'prest-4',
      image: '/img/barbearia.webp',
      category: 'Técnico',
      address: 'Avenida Brasil 500, Belo Horizonte, MG',
      hours: '08:00–17:00',
      rating: 'Novo',
      stars: '☆☆☆☆☆',
      photos: ['/img/barbearia.webp'],
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
      const matchesSearch =
        !term ||
        `${provider.name} ${provider.category} ${provider.address}`.toLowerCase().includes(term);
      const matchesCategory = !this.selectedCategory || provider.category === this.selectedCategory;
      const matchesFavorites = !this.onlyFavorites || this.favorites.has(provider.name);

      return matchesSearch && matchesCategory && matchesFavorites;
    });

    if (this.selectedSort === 'rating') {
      results = [...results].sort(
        (a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0),
      );
    } else if (this.selectedSort === 'name') {
      results = [...results].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
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

  toggleFavorite(providerName: string): void {
    const provider = this.providers.find((item) => item.name === providerName);
    if (!provider) {
      return;
    }

    const isFavorite = this.favorites.has(providerName);
    if (typeof provider.id !== 'number') {
      return;
    }
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

  openProviderProfile(provider: (typeof this.providers)[number]): void {
    this.selectedProvider = provider;
  }

  closeProviderProfile(): void {
    this.selectedProvider = null;
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
  }

  get notificationCount(): number {
    return this.notificacoes.length;
  }
}

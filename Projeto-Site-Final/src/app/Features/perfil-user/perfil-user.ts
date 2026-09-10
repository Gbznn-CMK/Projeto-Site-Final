import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-perfil-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,SidebarComponent],
  templateUrl: './perfil-user.html',
  styleUrl: './perfil-user.css',
})
export class perfilUser {
  constructor(private readonly router: Router) {}

  collapsed = false;
  mobileExpanded = false;
  profileMenuOpen = false;
  searchTerm = '';
  filterMenuOpen = false;
  selectedCategory = '';
  selectedSort = 'relevance';
  onlyFavorites = false;
  favorites = new Set<string>();

  readonly providers = [
    {
      name: 'Barbearia Central',
      image: '/img/barbearia.webp',
      category: 'Barbearia',
      address: 'Rua Belterra 291, Bangu, RJ',
      hours: '09:00–18:00',
      rating: '4.5/5',
      stars: '★★★★☆',
    },
    {
      name: 'Salão da Maria',
      image: '/img/salao-maria.png',
      category: 'Salão de Beleza',
      address: 'Av. Paulista 1000, São Paulo, SP',
      hours: '09:00–19:00',
      rating: '4.5/5',
      stars: '★★★★☆',
    },
    {
      name: 'Nails & More',
      image: '/img/manicure.png',
      category: 'Manicure',
      address: 'Rua das Flores 123, Rio de Janeiro, RJ',
      hours: '10:00–18:00',
      rating: '4.7/5',
      stars: '★★★★★',
    },
    {
      name: 'Studio Fit',
      image: '/img/studio-fit.png',
      category: 'Personal Trainer',
      address: 'Rua Ipiranga 55, Niterói, RJ',
      hours: '06:00–21:00',
      rating: '4.6/5',
      stars: '★★★★☆',
    },
  ];

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
        parseFloat(b.rating) - parseFloat(a.rating),
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
    if (this.favorites.has(providerName)) {
      this.favorites.delete(providerName);
    } else {
      this.favorites.add(providerName);
    }
  }

  isFavorite(providerName: string): boolean {
    return this.favorites.has(providerName);
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  logout(): void {
    this.profileMenuOpen = false;
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
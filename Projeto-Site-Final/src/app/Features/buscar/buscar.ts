import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

interface Provider {
  name: string;
  image: string;
  category: string;
  address: string;
  hours: string;
  rating: string;
  stars: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-buscar',
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './buscar.html',
  styleUrl: './buscar.css',
})
export class Buscar {
  searchTerm = '';
  filterMenuOpen = false;
  selectedCategory = '';
  selectedSort = 'relevance';
  onlyFavorites = false;
  favorites = new Set<string>();

  readonly categories = [
    'Barbearia',
    'Salão de Beleza',
    'Manicure',
    'Personal Trainer',
    'Pet Shop',
  ];

  readonly providers: Provider[] = [
    {
      name: 'Barbearia Gemeos',
      image: '/img/barbearia.webp',
      category: 'Barbearia',
      address: 'Rua Belterra 291, Bangu, RJ',
      hours: '09:00 às 18:00',
      rating: '4.5/5',
      stars: '★★★★☆',
      isAvailable: true,
    },
    {
      name: 'Manicure',
      image: '/img/manicure.png',
      category: 'Manicure',
      address: 'Top Shopping Nova Iguaçu',
      hours: '07:00 às 15:00',
      rating: '4.2/5',
      stars: '★★★★☆',
      isAvailable: false,
    },
    {
      name: 'Pet Shop Americano',
      image: '/img/pet-shop.png',
      category: 'Pet Shop',
      address: 'Rua Camara, Vila Kennedy, RJ',
      hours: '10:00 às 19:00',
      rating: '4.6/5',
      stars: '★★★★★',
      isAvailable: true,
    },
    // ... resto dos prestadores
  ];

  get filteredProviders(): Provider[] {
    const term = this.searchTerm.trim().toLowerCase();

    let results = this.providers.filter((provider) => {
      const matchesSearch =
        !term ||
        `${provider.name} ${provider.category} ${provider.address}`
          .toLowerCase()
          .includes(term);

      const matchesCategory =
        !this.selectedCategory || provider.category === this.selectedCategory;

      const matchesFavorites =
        !this.onlyFavorites || this.favorites.has(provider.name);

      return matchesSearch && matchesCategory && matchesFavorites;
    });

    if (this.selectedSort === 'rating') {
      results = [...results].sort(
        (a, b) => parseFloat(b.rating) - parseFloat(a.rating)
      );
    } else if (this.selectedSort === 'name') {
      results = [...results].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR')
      );
    } else if (this.selectedSort === 'available') {
      results = [...results].sort(
        (a, b) => Number(b.isAvailable) - Number(a.isAvailable)
      );
    }

    return results;
  }

  toggleFilterMenu(): void {
    this.filterMenuOpen = !this.filterMenuOpen;
  }

  selectCategory(category: string): void {
    this.selectedCategory = this.selectedCategory === category ? '' : category;
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedSort = 'relevance';
    this.onlyFavorites = false;
    this.searchTerm = '';
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

  @HostListener('document:click', ['$event'])
  closeFilterOnOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.filterMenuOpen && !target.closest('.filter-wrapper')) {
      this.filterMenuOpen = false;
    }
  }
}

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-home-prestador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-prestador.html',
  styleUrl: './home-prestador.css',
})
export class HomePrestador {
  collapsed = false;
  profileMenuOpen = false;
  searchTerm = '';
  filterMenuOpen = false;
  selectedCategory = '';
  selectedSort = 'relevance';

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }


  toggleFilterMenu(): void {
    this.filterMenuOpen = !this.filterMenuOpen;
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedSort = 'relevance';
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  logout(): void {
    this.profileMenuOpen = false;
  }

  @HostListener('window:resize')
  onResize(): void {
    // Mantém o comportamento do menu estável ao redimensionar a janela.
  }
}

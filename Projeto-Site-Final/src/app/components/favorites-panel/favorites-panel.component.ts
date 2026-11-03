import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Favorito, FavoritesService } from '../../core/services/favorites.service';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';

@Component({
  selector: 'app-favorites-panel',
  standalone: true,
  imports: [FavoriteButtonComponent, RouterLink],
  templateUrl: './favorites-panel.component.html',
  styleUrl: './favorites-panel.component.css',
})
export class FavoritesPanelComponent implements OnInit {
  lojas = signal<Favorito[]>([]);
  constructor(private favoritosService: FavoritesService) {}

  ngOnInit() {
    this.favoritosService.listarDetalhes().subscribe((data) => {
      this.lojas.set(data);
    });
  }

  removerFavorito(id: number): void {
    this.favoritosService.desfavoritar(id).subscribe(() => {
      this.lojas.update((lojas) => lojas.filter((loja) => loja.id !== id));
    });
  }
}

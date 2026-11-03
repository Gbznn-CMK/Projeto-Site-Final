import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Favorito, FavoritesService } from '../../core/services/favorites.service';
import {
  ProviderCardComponent,
  ProviderCardData,
} from '../../shared/components/provider-card/provider-card.component';

@Component({
  selector: 'app-favorites-panel',
  standalone: true,
  imports: [ProviderCardComponent, RouterLink],
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

  removerFavorito(id: string): void {
    this.favoritosService.desfavoritar(id).subscribe(() => {
      this.lojas.update((lojas) => lojas.filter((loja) => loja.id !== id));
    });
  }

  toProviderCard(loja: Favorito): ProviderCardData {
    return {
      id: loja.id,
      name: loja.nome,
      image: loja.imagemUrl,
      category: 'Prestador favorito',
      address: loja.endereco,
      hours: loja.horario,
      rating: 'Novo',
      stars: '☆☆☆☆☆',
    };
  }
}

import { Component, Input, output, signal } from '@angular/core';
import { FavoritesService } from '../../core/services/favorites.service';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.css',
})
export class FavoriteButtonComponent {
  @Input() lojaId!: number;
  @Input() set ativoInicial(v: boolean) {
    this.ativo.set(v);
  }

  ativo = signal(false);
  readonly favoritoAlterado = output<boolean>();

  constructor(private favoritosService: FavoritesService) {}

  toggleFavorito() {
    const acao = this.ativo()
      ? this.favoritosService.desfavoritar(this.lojaId)
      : this.favoritosService.favoritar(this.lojaId);

    acao.subscribe(() => {
      this.ativo.update((v) => !v);
      this.favoritoAlterado.emit(this.ativo());
    });
  }
}

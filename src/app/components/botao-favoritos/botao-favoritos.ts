import { Component, Input, signal } from '@angular/core';
import { FavoritosService } from '../../services/favoritos';

@Component({
  selector: 'app-botao-favorito',
  standalone: true,
  templateUrl: './botao-favoritos.html',
  styleUrl: './botao-favoritos.css'
})
export class BotaoFavoritoComponent {
  @Input() lojaId!: number;
  @Input() set ativoInicial(v: boolean) { this.ativo.set(v); }

  ativo = signal(false);

  constructor(private favoritosService: FavoritosService) {}

  toggleFavorito() {
    const acao = this.ativo()
      ? this.favoritosService.desfavoritar(this.lojaId)
      : this.favoritosService.favoritar(this.lojaId);

    acao.subscribe(() => this.ativo.update(v => !v));
  }
}
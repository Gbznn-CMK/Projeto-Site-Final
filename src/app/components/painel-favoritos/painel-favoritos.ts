import { Component, OnInit, signal } from '@angular/core';
import { FavoritosService } from '../../services/favoritos';
import { BotaoFavoritoComponent } from '../botao-favoritos/botao-favoritos';

@Component({
  selector: 'app-painel-favoritos',
  standalone: true,
  imports: [BotaoFavoritoComponent],
  templateUrl: './painel-favoritos.html',
  styleUrl: './painel-favoritos.css'
})
export class PainelFavoritosComponent implements OnInit {
  lojas = signal<any[]>([]);

  constructor(private favoritosService: FavoritosService) {}

  ngOnInit() {
    this.favoritosService.listarDetalhes().subscribe(data => {
      this.lojas.set(data);
    });
  }
}
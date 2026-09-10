import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritosService } from '../../services/favoritos';
import { BotaoFavoritoComponent } from '../botao-favoritos/botao-favoritos';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-painel-favoritos',
  standalone: true,
  imports: [BotaoFavoritoComponent, RouterLink],
  templateUrl: './painel-favoritos.html',
  styleUrl: './painel-favoritos.css'
})
export class PainelFavoritosComponent implements OnInit {
  lojas = signal<any[]>([]);

  constructor(
    private favoritosService: FavoritosService,
    private auth: AuthService,
  ) {}

  get userName(): string {
    return this.auth.currentUser()?.nome || 'Cliente';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  ngOnInit() {
    this.carregarFavoritos();
  }

  carregarFavoritos(): void {
    this.favoritosService.listarDetalhes().subscribe(data => {
      this.lojas.set(data);
    });
  }
}
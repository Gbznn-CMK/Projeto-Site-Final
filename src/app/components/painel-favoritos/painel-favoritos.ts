import { Component, HostListener, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { Favorito, FavoritosService } from '../../services/favoritos';
import { BotaoFavoritoComponent } from '../botao-favoritos/botao-favoritos';

@Component({
  selector: 'app-painel-favoritos',
  standalone: true,
  imports: [BotaoFavoritoComponent, RouterLink],
  templateUrl: './painel-favoritos.html',
  styleUrl: './painel-favoritos.css'
})
export class PainelFavoritosComponent implements OnInit {
  lojas = signal<Favorito[]>([]);
  collapsed = false;
  mobileExpanded = false;
  profileMenuOpen = false;

  constructor(
    private favoritosService: FavoritosService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.favoritosService.listarDetalhes().subscribe(data => {
      this.lojas.set(data);
    });
  }

  removerFavorito(id: number): void {
    this.favoritosService.desfavoritar(id).subscribe(() => {
      this.lojas.update((lojas) => lojas.filter((loja) => loja.id !== id));
    });
  }

  get userName(): string {
    return this.auth.currentUser()?.nome || 'Cliente';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  toggleSidebar(): void {
    if (this.isMobile()) {
      this.mobileExpanded = !this.mobileExpanded;
    } else {
      this.collapsed = !this.collapsed;
    }
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  logout(): void {
    this.profileMenuOpen = false;
    this.auth.logout();
    void this.router.navigate(['/login']);
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
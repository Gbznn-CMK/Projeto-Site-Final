import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-client-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  collapsed = false;
  profileMenuOpen = false;
  get userName(): string {
    return this.auth.currentUser()?.nome || 'Cliente';
  }
  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }
  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }
  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }
  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}

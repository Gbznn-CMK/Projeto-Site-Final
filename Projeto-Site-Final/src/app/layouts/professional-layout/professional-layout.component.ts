import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-professional-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './professional-layout.component.html',
  styleUrl: './professional-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  collapsed = false;
  profileMenuOpen = false;

  get userName(): string {
    return this.auth.currentUser()?.nome || 'Profissional';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }
  get userPhoto(): string {
    return this.auth.currentUser()?.foto || '';
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

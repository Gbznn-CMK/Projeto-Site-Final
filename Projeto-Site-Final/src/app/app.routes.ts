import { CanMatchFn, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { ClientHome } from './features/client-home/client-home.component';
import { ProviderHome } from './features/provider-home/provider-home.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { BookingComponent } from './features/client/booking/booking.component';
import { AppointmentsComponent } from './features/client/appointments/appointments.component';
import { AgendaComponent } from './features/provider-agenda/agenda.component';
import { FavoritesPanelComponent } from './components/favorites-panel/favorites-panel.component';
import { authGuard } from './core/guards/auth.guard';
import { ProviderServicesComponent } from './features/provider-services/provider-services.component';
import { ProviderAvailabilityComponent } from './features/provider-availability/provider-availability.component';
import { ProviderRegistrationComponent } from './features/provider-registration/provider-registration.component';
import { ClientProfileComponent } from './features/client-profile/client-profile.component';
import { SearchComponent } from './features/search/search.component';
import { ContactComponent } from './features/support/contact/contact.component';
import { SettingsComponent } from './features/settings/settings.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
import { ClientLayout } from './layouts/client-layout/client-layout.component';
import { ProviderLayout } from './layouts/provider-layout/provider-layout.component';
import { AuthService } from './core/services/auth.service';
import { TipoUsuario } from './core/models/types';

const roleMatch = (role: TipoUsuario): CanMatchFn => () => inject(AuthService).getUserRole() === role;

export const routes: Routes = [
  // Public paths remain in Portuguese for backwards-compatible deep links.
  { path: '', redirectTo: 'home-cliente', pathMatch: 'full' },
  {
    path: '',
    component: ClientLayout,
    canMatch: [roleMatch('cliente')],
    canActivate: [authGuard],
    data: { roles: ['cliente'] },
    children: [
      { path: 'home-cliente', component: ClientHome },
      { path: 'buscar', component: SearchComponent },
      { path: 'agendamentos', component: AppointmentsComponent },
      { path: 'agendamentos/novo/:prestadorId', component: BookingComponent },
      { path: 'favoritos', component: FavoritesPanelComponent },
      { path: 'perfil', component: ClientProfileComponent },
    ],
  },
  {
    path: '',
    component: ProviderLayout,
    canMatch: [roleMatch('prestador')],
    canActivate: [authGuard],
    data: { roles: ['prestador'] },
    children: [
      { path: 'home-prestador', component: ProviderHome },
      { path: 'agenda-prestador', component: AgendaComponent },
      { path: 'servicos-prestador', component: ProviderServicesComponent },
      { path: 'disponibilidade-prestador', component: ProviderAvailabilityComponent },
      { path: 'perfil', component: ClientProfileComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: RegisterComponent },
  {
    path: 'cadastro-loja',
    component: ProviderRegistrationComponent,
    canActivate: [authGuard],
    data: { roles: ['prestador'] },
  },
  { path: 'agendamentos/novo', redirectTo: 'buscar', pathMatch: 'full' },
  {
    path: 'suporte',
    component: ContactComponent,
    canActivate: [authGuard],
    data: { roles: ['cliente', 'prestador'] },
  },
  {
    path: 'configuracoes',
    component: SettingsComponent,
    canActivate: [authGuard],
    data: { roles: ['cliente', 'prestador'] },
  },
  { path: 'meus-agendamentos', redirectTo: 'agendamentos', pathMatch: 'full' },
  { path: 'prestadores', redirectTo: 'buscar', pathMatch: 'full' },
  // Mantém compatibilidade com links antigos enquanto o fluxo é migrado.
  { path: 'lista-agendamentos', redirectTo: 'agendamentos', pathMatch: 'full' },
  { path: 'novo-agendamento', redirectTo: 'buscar', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

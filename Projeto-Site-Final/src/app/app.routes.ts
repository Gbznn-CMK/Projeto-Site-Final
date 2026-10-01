import { Routes } from '@angular/router';
import { HomeCliente } from './features/home-cliente/home-cliente';
import { HomePrestador } from './features/home-prestador/home-prestador';
import { LoginComponent } from './features/login/login';
import { CadastroComponent } from './features/cadastro/cadastro';
import { AgendarComponent } from './features/client/agendar/agendar.component';
import { MeusAgendamentosComponent } from './features/client/meus-agendamentos/meus-agendamentos.component';
import { AgendaComponent } from './features/provider/agenda/agenda.component';
import { PainelFavoritosComponent } from './components/painel-favoritos/painel-favoritos';
import { authGuard } from './core/guards/auth.guard';
import { ServicosPrestadorComponent } from './features/servicos-prestador/servicos-prestador';
import { DisponibilidadePrestadorComponent } from './features/disponibilidade-prestador/disponibilidade-prestador';
import { CadastroLojaComponent } from './features/cadastro-loja/cadastro-loja';
import { PerfilComponent } from './features/perfil-cliente/perfil-cliente';
import { BuscarComponent } from './features/buscar/buscar';

export const routes: Routes = [
  { path: '', redirectTo: 'home-cliente', pathMatch: 'full' },
  {
    path: 'home-cliente',
    component: HomeCliente,
    canActivate: [authGuard],
    data: { roles: ['cliente'] },
  },
  {
    path: 'home-prestador',
    component: HomePrestador,
    canActivate: [authGuard],
    data: { roles: ['prestador'] },
  },
  { path: 'perfil', component: PerfilComponent, data: { roles: ['cliente', 'prestador'] } },
  {
    path: 'buscar',
    component: BuscarComponent,
    canActivate: [authGuard],
    data: { roles: ['cliente'] },
  },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  {
    path: 'cadastro-loja',
    component: CadastroLojaComponent,
    canActivate: [authGuard],
    data: { roles: ['prestador'] },
  },
  {
    path: 'agendamentos',
    component: MeusAgendamentosComponent,
    canActivate: [authGuard],
    data: { roles: ['cliente'] },
  },
  {
    path: 'agendamentos/novo/:prestadorId',
    component: AgendarComponent,
    canActivate: [authGuard],
    data: { roles: ['cliente'] },
  },
  { path: 'agendamentos/novo', redirectTo: 'buscar', pathMatch: 'full' },
  {
    path: 'favoritos',
    component: PainelFavoritosComponent,
    canActivate: [authGuard],
    data: { roles: ['cliente'] },
  },
  {
    path: 'agenda-prestador',
    component: AgendaComponent,
    canActivate: [authGuard],
    data: { roles: ['prestador'] },
  },
  {
    path: 'servicos-prestador',
    component: ServicosPrestadorComponent,
    canActivate: [authGuard],
    data: { roles: ['prestador'] },
  },
  {
    path: 'disponibilidade-prestador',
    component: DisponibilidadePrestadorComponent,
    canActivate: [authGuard],
    data: { roles: ['prestador'] },
  },
  { path: 'meus-agendamentos', redirectTo: 'agendamentos', pathMatch: 'full' },
  { path: 'prestadores', redirectTo: 'buscar', pathMatch: 'full' },
  // Mantém compatibilidade com links antigos enquanto o fluxo é migrado.
  { path: 'lista-agendamentos', redirectTo: 'agendamentos', pathMatch: 'full' },
  { path: 'novo-agendamento', redirectTo: 'buscar', pathMatch: 'full' },
];

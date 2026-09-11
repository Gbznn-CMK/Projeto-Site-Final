import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./features/auth/cadastro/cadastro.component').then(m => m.CadastroComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./features/client/inicio/inicio.component').then(m => m.InicioComponent)
      },
      {
        path: 'prestadores',
        loadComponent: () => import('./features/client/buscar-prestadores/buscar-prestadores.component').then(m => m.BuscarPrestadoresComponent)
      },
      {
        path: 'prestador/:id',
        loadComponent: () => import('./features/client/perfil-prestador/perfil-prestador.component').then(m => m.PerfilPrestadorComponent)
      },
      {
        path: 'agendar/:prestadorId',
        loadComponent: () => import('./features/client/agendar/agendar.component').then(m => m.AgendarComponent)
      },
      {
        path: 'meus-agendamentos',
        loadComponent: () => import('./features/client/meus-agendamentos/meus-agendamentos.component').then(m => m.MeusAgendamentosComponent)
      },
      {
        path: 'favoritos',
        loadComponent: () => import('./features/client/favoritos/favoritos.component').then(m => m.FavoritosComponent)
      },
      {
        path: 'painel',
        canActivate: [roleGuard(['prestador'])],
        loadComponent: () => import('./features/provider/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'minha-agenda',
        canActivate: [roleGuard(['prestador'])],
        loadComponent: () => import('./features/provider/agenda/agenda.component').then(m => m.AgendaComponent)
      },
      {
        path: 'meus-servicos',
        canActivate: [roleGuard(['prestador'])],
        loadComponent: () => import('./features/provider/meus-servicos/meus-servicos.component').then(m => m.MeusServicosComponent)
      },
      {
        path: 'disponibilidade',
        canActivate: [roleGuard(['prestador'])],
        loadComponent: () => import('./features/provider/disponibilidade/disponibilidade.component').then(m => m.DisponibilidadeComponent)
      },
      {
        path: 'sac',
        loadComponent: () => import('./features/support/sac/sac.component').then(m => m.SacComponent)
      },
      {
        path: 'configuracoes',
        loadComponent: () => import('./features/configuracoes/configuracoes.component').then(m => m.ConfiguracoesComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/inicio'
  }

];

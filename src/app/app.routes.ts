import { Routes } from '@angular/router';
import { HomeCliente } from './features/home-cliente/home-cliente';
import { HomePrestador } from './features/home-prestador/home-prestador';
import { LoginComponent } from './features/login/login';
import { CadastroComponent } from './features/cadastro/cadastro';
import { ListaAgendamentosComponent } from './features/agendamentos/pages/lista-agendamentos/lista-agendamentos';
import { NovoAgendamentoComponent } from './features/agendamentos/pages/novo-agendamento/novo-agendamento';

export const routes: Routes = [
  { path: '', redirectTo: 'home-cliente', pathMatch: 'full' },
  { path: 'home-cliente', component: HomeCliente },
  { path: 'home-prestador', component: HomePrestador },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'agendamentos', component: ListaAgendamentosComponent },
  { path: 'agendamentos/novo', component: NovoAgendamentoComponent },
  // Mantém compatibilidade com links antigos enquanto o fluxo é migrado.
  { path: 'lista-agendamentos', redirectTo: 'agendamentos', pathMatch: 'full' },
  { path: 'novo-agendamento', redirectTo: 'agendamentos/novo', pathMatch: 'full' },
];

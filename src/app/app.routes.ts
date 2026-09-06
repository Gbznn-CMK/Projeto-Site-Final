import { Routes } from '@angular/router';
import { NovoAgendamentoComponent } from './features/agendamentos/pages/novo-agendamento/novo-agendamento';
import { ListaAgendamentosComponent } from './features/agendamentos/pages/lista-agendamentos/lista-agendamentos';

export const routes: Routes = [
  { path: '', redirectTo: 'novo-agendamento', pathMatch: 'full' },
  { path: 'novo-agendamento', component: NovoAgendamentoComponent },
  { path: 'agendamentos', component: ListaAgendamentosComponent }
];
import { Routes } from '@angular/router';
import { HomeCliente } from './features/home-cliente/home-cliente';
import { HomePrestador } from './features/home-prestador/home-prestador';

export const routes: Routes = [
  { path: '', redirectTo: 'home-cliente', pathMatch: 'full' },
  { path: 'home-cliente', component: HomeCliente },
  { path: 'home-prestador', component: HomePrestador },
];
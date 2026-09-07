import { Routes } from '@angular/router';
import { HomeCliente } from './features/home-cliente/home-cliente';

export const routes: Routes = [
  { path: '', redirectTo: 'home-cliente', pathMatch: 'full' },
  { path: 'home-cliente', component: HomeCliente },
];
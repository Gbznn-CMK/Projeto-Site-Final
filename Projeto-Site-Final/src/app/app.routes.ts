import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Entrar | Nahora Serv' },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];

import { Routes } from '@angular/router';
import { CadastroComponent } from './features/cadastro/cadastro';
import { LoginComponent } from './features/login/login';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Entrar | NaHora Serv' },
  { path: 'cadastro', component: CadastroComponent, title: 'Cadastro | NaHora Serv' },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];

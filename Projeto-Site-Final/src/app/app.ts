import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { perfilUser } from './Features/perfil-user/perfil-user';
import { Buscar } from "./Features/buscar/buscar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, perfilUser, Buscar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Projeto-Site-Final');
}

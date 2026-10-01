import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/types';
import { LojaService } from '../../core/services/loja';

@Component({
  selector: 'app-cadastro-loja',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-loja.html',
  styleUrl: './cadastro-loja.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CadastroLojaComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly lojaService = inject(LojaService);
  private readonly router = inject(Router);
  private currentUser: Usuario | null = null;

  readonly lojaForm = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['Barbearia', Validators.required],
    endereco: ['', [Validators.required, Validators.minLength(5)]],
    horario: ['', [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  onSubmit(): void {
    if (this.lojaForm.invalid) {
      this.lojaForm.markAllAsTouched();
      return;
    }

    const user = this.currentUser;
    if (!user || user.tipo !== 'prestador') {
      void this.router.navigate(['/login']);
      return;
    }

    this.lojaService.criar({
      ...this.lojaForm.getRawValue(),
      proprietarioEmail: user.email,
      imagemUrl: '/img/barbearia.webp',
      disponivel: true,
      servicos: [],
    });
    void this.router.navigate(['/servicos-prestador']);
  }
}

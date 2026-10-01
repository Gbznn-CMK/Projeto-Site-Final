import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TipoUsuario } from '../../core/models/types';

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class CadastroComponent {
  showPassword = false;
  showConfirmPassword = false;
  registerMessage = '';

  readonly registerForm = new FormBuilder().nonNullable.group(
    {
      tipoUsuario: ['', [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(8)]],
    },
    { validators: this.passwordsMatchValidator },
  );

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  selectUserType(type: 'cliente' | 'prestador'): void {
    this.registerForm.controls.tipoUsuario.setValue(type);
    this.registerForm.controls.tipoUsuario.markAsTouched();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.registerMessage = '';
      return;
    }

    const user = this.registerForm.getRawValue();
    if (!this.isUserType(user.tipoUsuario)) {
      this.registerMessage = '';
      return;
    }

    this.auth.signup({
      nome: user.nome,
      email: user.email,
      password: user.senha,
      telefone: '',
      tipo: user.tipoUsuario,
    }).subscribe({
      next: () => {
        this.registerMessage = 'Cadastro realizado com sucesso!';
        void this.router.navigate([
          user.tipoUsuario === 'prestador' ? '/cadastro-loja' : '/home-cliente',
        ]);
      },
      error: (error: Error) => {
        this.registerMessage = error.message || 'Este email já está cadastrado.';
      },
    });
  }

  isInvalid(field: 'nome' | 'email' | 'senha' | 'confirmarSenha'): boolean {
    const control = this.registerForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senha')?.value;
    const confirmarSenha = control.get('confirmarSenha')?.value;

    if (!senha || !confirmarSenha) {
      return null;
    }

    return senha === confirmarSenha ? null : { passwordsMismatch: true };
  }

  private isUserType(value: string): value is TipoUsuario {
    return value === 'cliente' || value === 'prestador';
  }
}

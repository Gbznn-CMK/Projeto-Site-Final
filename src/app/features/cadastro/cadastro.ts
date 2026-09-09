import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type UserType = 'cliente' | 'prestador';

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

    this.registerMessage = 'Cadastro realizado com sucesso!';
    this.registerForm.reset();
  }

  isInvalid(field: 'nome' | 'email' | 'senha' | 'confirmarSenha'): boolean {
    const control = this.registerForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senha')?.value;
    const confirmarSenha = control.get('confirmarSenha')?.value;

    return senha === confirmarSenha ? null : { passwordsMismatch: true };
  }
}

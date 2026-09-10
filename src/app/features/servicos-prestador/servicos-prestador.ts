import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

interface ServicoPrestador {
  id: number;
  nome: string;
  categoria: string;
  duracao: number;
  valor: number;
  descricao: string;
  ativo: boolean;
}

@Component({
  selector: 'app-servicos-prestador',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './servicos-prestador.html',
  styleUrl: './servicos-prestador.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicosPrestadorComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly editingId = signal<number | null>(null);
  readonly savedMessage = signal('');
  readonly servicos = signal<ServicoPrestador[]>([
    {
      id: 1,
      nome: 'Corte masculino',
      categoria: 'Barbearia',
      duracao: 45,
      valor: 45,
      descricao: 'Corte personalizado com acabamento.',
      ativo: true,
    },
    {
      id: 2,
      nome: 'Barba e toalha quente',
      categoria: 'Barbearia',
      duracao: 30,
      valor: 35,
      descricao: 'Barba completa com toalha quente.',
      ativo: true,
    },
  ]);

  readonly serviceForm = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['Barbearia', Validators.required],
    duracao: [30, [Validators.required, Validators.min(5)]],
    valor: [0, [Validators.required, Validators.min(0)]],
    descricao: ['', [Validators.required, Validators.maxLength(180)]],
  });

  get userName(): string {
    return this.auth.currentUser()?.nome || 'Prestador';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  saveService(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const value = this.serviceForm.getRawValue();
    const editingId = this.editingId();
    if (editingId === null) {
      this.servicos.update((items) => [...items, { ...value, id: Date.now(), ativo: true }]);
      this.savedMessage.set('Serviço criado com sucesso.');
    } else {
      this.servicos.update((items) => items.map((item) => item.id === editingId ? { ...item, ...value } : item));
      this.savedMessage.set('Serviço atualizado com sucesso.');
    }

    this.cancelEdit();
    window.setTimeout(() => this.savedMessage.set(''), 3000);
  }

  editService(service: ServicoPrestador): void {
    this.editingId.set(service.id);
    this.serviceForm.setValue({
      nome: service.nome,
      categoria: service.categoria,
      duracao: service.duracao,
      valor: service.valor,
      descricao: service.descricao,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  removeService(id: number): void {
    this.servicos.update((items) => items.filter((item) => item.id !== id));
    if (this.editingId() === id) {
      this.cancelEdit();
    }
  }

  toggleService(id: number): void {
    this.servicos.update((items) => items.map((item) => item.id === id ? { ...item, ativo: !item.ativo } : item));
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.serviceForm.reset({ nome: '', categoria: 'Barbearia', duracao: 30, valor: 0, descricao: '' });
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PrestadorService } from '../../core/services/prestador.service';
import { ServicoService } from '../../core/services/servico.service';
import { Servico } from '../../core/models/types';

type ServicoPrestador = Servico;

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
  private readonly prestadorService = inject(PrestadorService);
  private readonly servicoService = inject(ServicoService);
  private readonly router = inject(Router);

  readonly editingId = signal<string | null>(null);
  readonly savedMessage = signal('');
  readonly servicos = signal<ServicoPrestador[]>([]);
  private prestadorId = '';

  readonly serviceForm = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['Barbearia', Validators.required],
    duracaoMinutos: [30, [Validators.required, Validators.min(5)]],
    preco: [0, [Validators.required, Validators.min(0)]],
    descricao: ['', [Validators.required, Validators.maxLength(180)]],
  });

  constructor() {
    const userId = this.auth.currentUser()?.id;
    if (userId) {
      this.prestadorService.getByUsuarioId(userId).subscribe((provider) => {
        if (!provider) return;
        this.prestadorId = provider.id;
        this.servicoService.getAllByPrestador(provider.id).subscribe((services) => {
          this.servicos.set(services);
        });
      });
    }
  }

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
      this.servicos.update((items) => {
        const next = [...items, {
          ...value,
          id: '',
          prestadorId: this.prestadorId,
          ativo: true,
        }];
        this.servicoService.create(next[next.length - 1]).subscribe((created) => this.servicos.set(
          this.servicos().map((item) => item.id ? item : created),
        ));
        return next;
      });
      this.savedMessage.set('Serviço criado com sucesso.');
    } else {
      this.servicos.update((items) => {
        const current = items.find((item) => item.id === editingId);
        if (current) {
          this.servicoService.update({ ...current, ...value }).subscribe();
        }
        const next = items.map((item) => (item.id === editingId ? { ...item, ...value } : item));
        return next;
      });
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
      duracaoMinutos: service.duracaoMinutos,
      preco: service.preco,
      descricao: service.descricao,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  removeService(id: string): void {
    this.servicos.update((items) => {
      const next = items.filter((item) => item.id !== id);
      this.servicoService.delete(id).subscribe();
      return next;
    });
    if (this.editingId() === id) {
      this.cancelEdit();
    }
  }

  toggleService(id: string): void {
    this.servicos.update((items) => {
      const next = items.map((item) => (item.id === id ? { ...item, ativo: !item.ativo } : item));
      const service = next.find((item) => item.id === id);
      if (service) this.servicoService.update(service).subscribe();
      return next;
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.serviceForm.reset({
      nome: '',
      categoria: 'Barbearia',
      duracaoMinutos: 30,
      preco: 0,
      descricao: '',
    });
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

}

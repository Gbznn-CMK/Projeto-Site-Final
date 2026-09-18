import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { LojaService } from '../../core/services/loja';
import { ServicoLoja } from '../../core/models/loja';

type ServicoPrestador = ServicoLoja;

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
  private readonly lojaService = inject(LojaService);
  private readonly router = inject(Router);

  readonly editingId = signal<number | null>(null);
  readonly savedMessage = signal('');
  readonly servicos = signal<ServicoPrestador[]>(this.obterServicosIniciais());

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
      this.servicos.update((items) => {
        const next = [...items, { ...value, id: Date.now(), ativo: true }];
        this.persistirServicos(next);
        return next;
      });
      this.savedMessage.set('Serviço criado com sucesso.');
    } else {
      this.servicos.update((items) => {
        const next = items.map((item) => item.id === editingId ? { ...item, ...value } : item);
        this.persistirServicos(next);
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
      duracao: service.duracao,
      valor: service.valor,
      descricao: service.descricao,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  removeService(id: number): void {
    this.servicos.update((items) => {
      const next = items.filter((item) => item.id !== id);
      this.persistirServicos(next);
      return next;
    });
    if (this.editingId() === id) {
      this.cancelEdit();
    }
  }

  toggleService(id: number): void {
    this.servicos.update((items) => {
      const next = items.map((item) => item.id === id ? { ...item, ativo: !item.ativo } : item);
      this.persistirServicos(next);
      return next;
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.serviceForm.reset({ nome: '', categoria: 'Barbearia', duracao: 30, valor: 0, descricao: '' });
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  private obterServicosIniciais(): ServicoPrestador[] {
    const email = this.auth.currentUser()?.email;
    const loja = email ? this.lojaService.obterDoPrestador(email) : undefined;
    return loja?.servicos ?? [];
  }

  private persistirServicos(servicos: ServicoPrestador[]): void {
    const email = this.auth.currentUser()?.email;
    if (email && this.lojaService.obterDoPrestador(email)) {
      this.lojaService.atualizarServicos(email, servicos);
    }
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

interface HorarioDisponivel {
  id: number;
  dia: string;
  inicio: string;
  fim: string;
  ativo: boolean;
}

@Component({
  selector: 'app-disponibilidade-prestador',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './disponibilidade-prestador.html',
  styleUrl: './disponibilidade-prestador.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisponibilidadePrestadorComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly editingId = signal<number | null>(null);
  readonly savedMessage = signal('');
  readonly horarios = signal<HorarioDisponivel[]>([
    { id: 1, dia: 'Segunda-feira', inicio: '09:00', fim: '18:00', ativo: true },
    { id: 2, dia: 'Terça-feira', inicio: '09:00', fim: '18:00', ativo: true },
    { id: 3, dia: 'Quarta-feira', inicio: '09:00', fim: '18:00', ativo: true },
    { id: 4, dia: 'Quinta-feira', inicio: '09:00', fim: '18:00', ativo: true },
    { id: 5, dia: 'Sexta-feira', inicio: '09:00', fim: '17:00', ativo: true },
  ]);

  readonly availabilityForm = this.formBuilder.nonNullable.group({
    dia: ['Segunda-feira', Validators.required],
    inicio: ['09:00', Validators.required],
    fim: ['18:00', Validators.required],
  });

  get userName(): string {
    return this.auth.currentUser()?.nome || 'Prestador';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  saveAvailability(): void {
    if (this.availabilityForm.invalid) {
      this.availabilityForm.markAllAsTouched();
      return;
    }

    const value = this.availabilityForm.getRawValue();
    if (value.inicio >= value.fim) {
      this.availabilityForm.controls.fim.setErrors({ invalidRange: true });
      return;
    }

    const editingId = this.editingId();
    if (editingId === null) {
      this.horarios.update((items) => [...items, { ...value, id: Date.now(), ativo: true }]);
      this.savedMessage.set('Horário criado com sucesso.');
    } else {
      this.horarios.update((items) => items.map((item) => item.id === editingId ? { ...item, ...value } : item));
      this.savedMessage.set('Horário atualizado com sucesso.');
    }

    this.cancelEdit();
    window.setTimeout(() => this.savedMessage.set(''), 3000);
  }

  editAvailability(schedule: HorarioDisponivel): void {
    this.editingId.set(schedule.id);
    this.availabilityForm.setValue({ dia: schedule.dia, inicio: schedule.inicio, fim: schedule.fim });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  removeAvailability(id: number): void {
    this.horarios.update((items) => items.filter((item) => item.id !== id));
    if (this.editingId() === id) {
      this.cancelEdit();
    }
  }

  toggleAvailability(id: number): void {
    this.horarios.update((items) => items.map((item) => item.id === id ? { ...item, ativo: !item.ativo } : item));
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.availabilityForm.reset({ dia: 'Segunda-feira', inicio: '09:00', fim: '18:00' });
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}

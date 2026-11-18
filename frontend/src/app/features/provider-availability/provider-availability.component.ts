import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Disponibilidade } from '../../core/models/types';
import { AuthService } from '../../core/services/auth.service';
import { AvailabilityService } from '../../core/services/availability.service';
import { ProviderService } from '../../core/services/provider.service';

interface HorarioDisponivel {
  id: number;
  dia: string;
  inicio: string;
  fim: string;
  ativo: boolean;
}

@Component({
  selector: 'app-provider-availability',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './provider-availability.component.html',
  styleUrl: './provider-availability.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderAvailabilityComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly providerService = inject(ProviderService);
  private readonly availabilityService = inject(AvailabilityService);
  private prestadorId = '';

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

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe((user) => {
      if (!user) return;
      this.providerService.getByUsuarioId(user.id).subscribe((provider) => {
        if (!provider) return;
        this.prestadorId = provider.id;
        this.availabilityService.getDisponibilidadesForPrestador(provider.id).subscribe((items) => {
          this.horarios.set(
            items.map((item) => ({
              id: Number(item.id.replace(/\D/g, '')) || Date.now(),
              dia: this.dayName(item.diaSemana),
              inicio: item.horaInicio,
              fim: item.horaFim,
              ativo: item.ativo,
            })),
          );
        });
      });
    });
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
      this.horarios.update((items) =>
        items.map((item) => (item.id === editingId ? { ...item, ...value } : item)),
      );
      this.savedMessage.set('Horário atualizado com sucesso.');
    }

    this.cancelEdit();
    this.persistHorarios();
    window.setTimeout(() => this.savedMessage.set(''), 3000);
  }

  editAvailability(schedule: HorarioDisponivel): void {
    this.editingId.set(schedule.id);
    this.availabilityForm.setValue({
      dia: schedule.dia,
      inicio: schedule.inicio,
      fim: schedule.fim,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  removeAvailability(id: number): void {
    this.horarios.update((items) => items.filter((item) => item.id !== id));
    if (this.editingId() === id) {
      this.cancelEdit();
    }
    this.persistHorarios();
  }

  toggleAvailability(id: number): void {
    this.horarios.update((items) =>
      items.map((item) => (item.id === id ? { ...item, ativo: !item.ativo } : item)),
    );
    this.persistHorarios();
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.availabilityForm.reset({ dia: 'Segunda-feira', inicio: '09:00', fim: '18:00' });
  }

  private persistHorarios(): void {
    if (!this.prestadorId) return;
    const disponibilidades: Disponibilidade[] = this.horarios().map((item) => ({
      id: `disp-${this.prestadorId}-${this.dayNumber(item.dia)}-${item.id}`,
      prestadorId: this.prestadorId,
      diaSemana: this.dayNumber(item.dia),
      horaInicio: item.inicio,
      horaFim: item.fim,
      ativo: item.ativo,
    }));
    this.availabilityService.updateDisponibilidades(this.prestadorId, disponibilidades).subscribe();
  }

  private dayNumber(day: string): number {
    return ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'].indexOf(day);
  }

  private dayName(day: number): string {
    return ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'][day] || 'Segunda-feira';
  }
}

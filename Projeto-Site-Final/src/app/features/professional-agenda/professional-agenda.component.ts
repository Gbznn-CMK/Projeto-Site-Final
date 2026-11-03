import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CalendarComponent, CalendarEvent } from '../../shared/components/calendar/calendar.component';
import { AppointmentService } from '../../core/services/appointment.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-professional-agenda',
  imports: [CalendarComponent],
  templateUrl: './professional-agenda.component.html',
  styleUrl: './professional-agenda.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalAgenda implements OnInit {
  calendarEvents: CalendarEvent[] = [];

  constructor(
    private readonly auth: AuthService,
    private readonly appointments: AppointmentService,
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (!user) return;

    this.appointments.getByProfissional(user.id).subscribe((items) => {
      this.calendarEvents = items.map((item) => ({
        id: item.id,
        start: item.dataHora,
        title: item.servicoNome || 'Atendimento',
        subtitle: item.profissionalNome || 'Cliente',
        status: item.status,
      }));
    });
  }
}

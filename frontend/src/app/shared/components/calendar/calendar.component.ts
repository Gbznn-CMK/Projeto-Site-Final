import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface CalendarEvent {
  id: string;
  start: string;
  title: string;
  subtitle?: string;
  status?: string;
}

interface CalendarDay {
  date: Date;
  key: string;
  dayNumber: number;
  inCurrentMonth: boolean;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  @Input() events: CalendarEvent[] = [];
  @Input() emptyLabel = 'Nenhum compromisso';

  readonly weekDays = ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'];
  currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  get monthLabel(): string {
    return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(
      this.currentMonth,
    );
  }

  get days(): CalendarDay[] {
    const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const firstVisibleDay = new Date(firstDay);
    firstVisibleDay.setDate(firstDay.getDate() - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstVisibleDay);
      date.setDate(firstVisibleDay.getDate() + index);
      return {
        date,
        key: this.dateKey(date),
        dayNumber: date.getDate(),
        inCurrentMonth: date.getMonth() === this.currentMonth.getMonth(),
      };
    });
  }

  previousMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1,
    );
  }

  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1,
    );
  }

  goToToday(): void {
    const today = new Date();
    this.currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  eventsFor(day: CalendarDay): CalendarEvent[] {
    return this.events
      .filter((event) => this.dateKey(new Date(event.start)) === day.key)
      .sort((first, second) => first.start.localeCompare(second.start));
  }

  eventTime(event: CalendarEvent): string {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(event.start));
  }

  isToday(day: CalendarDay): boolean {
    return this.dateKey(day.date) === this.dateKey(new Date());
  }

  trackDay(_: number, day: CalendarDay): string {
    return day.key;
  }

  trackEvent(_: number, event: CalendarEvent): string {
    return event.id;
  }

  private dateKey(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}

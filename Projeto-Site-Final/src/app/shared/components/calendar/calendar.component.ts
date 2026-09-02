import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar">
      <div class="calendar-header">
        <button class="nav-btn" (click)="previousMonth()">←</button>
        <h3 class="calendar-title">{{ getMonthYear() }}</h3>
        <button class="nav-btn" (click)="nextMonth()">→</button>
      </div>

      <div class="weekdays">
        <div class="weekday" *ngFor="let day of weekdays">{{ day }}</div>
      </div>

      <div class="days">
        <button 
          *ngFor="let day of daysInMonth"
          class="day"
          [class.other-month]="day === 0"
          [class.today]="isToday(day)"
          [class.selected]="isSelected(day)"
          [class.disabled]="!isDateAvailable(day)"
          (click)="selectDate(day)"
          [disabled]="!isDateAvailable(day) || day === 0"
        >
          {{ day || '' }}
        </button>
      </div>

      <div class="selected-date" *ngIf="selectedDay">
        <strong>Data selecionada:</strong> {{ formatSelectedDate() }}
      </div>
    </div>
  `,
  styles: [`
    .calendar {
      background-color: white;
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      box-shadow: var(--shadow-md);
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-lg);
    }

    .nav-btn {
      background-color: var(--color-primary);
      color: white;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: var(--font-size-lg);
      transition: background-color var(--transition-base);
    }

    .nav-btn:hover {
      background-color: var(--color-primary-light);
    }

    .calendar-title {
      margin: 0;
      font-size: var(--font-size-lg);
      color: var(--color-neutral-900);
      min-width: 200px;
      text-align: center;
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .weekday {
      text-align: center;
      font-weight: var(--font-weight-semibold);
      color: var(--color-primary);
      font-size: var(--font-size-sm);
      padding: var(--space-sm);
    }

    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--space-sm);
      margin-bottom: var(--space-lg);
    }

    .day {
      aspect-ratio: 1;
      border: 1px solid var(--color-neutral-300);
      border-radius: var(--radius-md);
      background-color: white;
      cursor: pointer;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      transition: all var(--transition-base);
      color: var(--color-neutral-900);
    }

    .day:hover:not(:disabled) {
      border-color: var(--color-primary);
      background-color: var(--color-neutral-50);
      transform: scale(1.05);
    }

    .day.other-month {
      color: var(--color-neutral-300);
      background-color: var(--color-neutral-50);
      cursor: default;
    }

    .day.today {
      background-color: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
      font-weight: var(--font-weight-bold);
    }

    .day.selected {
      background-color: var(--color-success);
      color: white;
      border-color: var(--color-success);
      font-weight: var(--font-weight-bold);
    }

    .day.disabled {
      background-color: var(--color-neutral-100);
      color: var(--color-neutral-400);
      cursor: not-allowed;
      border-color: var(--color-neutral-200);
    }

    .day.disabled:hover {
      transform: none;
      border-color: var(--color-neutral-200);
    }

    .selected-date {
      text-align: center;
      padding: var(--space-lg);
      background-color: var(--color-neutral-50);
      border-radius: var(--radius-md);
      color: var(--color-neutral-900);
    }

    @media (max-width: 768px) {
      .calendar {
        padding: var(--space-md);
      }

      .calendar-title {
        font-size: var(--font-size-base);
        min-width: auto;
      }
    }
  `]
})
export class CalendarComponent implements OnInit {
  @Input() availableDates: Date[] = [];
  @Output() dateSelected = new EventEmitter<Date>();

  weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  currentDate = new Date();
  selectedDay: number | null = null;
  daysInMonth: (number | 0)[] = [];

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // First day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();

    // Fill days array
    this.daysInMonth = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      this.daysInMonth.push(0);
    }

    // Days of month
    for (let i = 1; i <= daysCount; i++) {
      this.daysInMonth.push(i);
    }
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    this.selectedDay = null;
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    this.selectedDay = null;
    this.generateCalendar();
  }

  selectDate(day: number) {
    if (day === 0 || !this.isDateAvailable(day)) return;
    
    this.selectedDay = day;
    const selected = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    this.dateSelected.emit(selected);
  }

  isToday(day: number): boolean {
    if (day === 0) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentDate.getFullYear() === today.getFullYear()
    );
  }

  isSelected(day: number): boolean {
    return day === this.selectedDay && day !== 0;
  }

  isDateAvailable(day: number): boolean {
    if (day === 0) return false;
    
    // Allow selecting any date from today onwards
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return false;

    if (this.availableDates.length === 0) return true;

    return this.availableDates.some(availableDate => {
      const available = new Date(availableDate);
      return available.getFullYear() === date.getFullYear() &&
        available.getMonth() === date.getMonth() &&
        available.getDate() === date.getDate();
    });
  }

  getMonthYear(): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  formatSelectedDate(): string {
    if (!this.selectedDay) return '';
    const selected = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.selectedDay);
    const day = String(selected.getDate()).padStart(2, '0');
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const year = selected.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

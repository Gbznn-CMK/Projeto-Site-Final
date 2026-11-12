import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentCardComponent } from './appointment-card.component';

describe('AppointmentCardComponent', () => {
  let fixture: ComponentFixture<AppointmentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppointmentCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(AppointmentCardComponent);
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

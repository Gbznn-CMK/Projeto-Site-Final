import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BookingComponent } from './booking.component';

describe('BookingComponent', () => {
  let fixture: ComponentFixture<BookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(BookingComponent);
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

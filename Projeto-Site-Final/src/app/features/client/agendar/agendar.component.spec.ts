import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AgendarComponent } from './agendar.component';

describe('AgendarComponent', () => {
  let fixture: ComponentFixture<AgendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendarComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(AgendarComponent);
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

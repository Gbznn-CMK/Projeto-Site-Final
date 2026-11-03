import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendaComponent } from './agenda.component';

describe('AgendaComponent', () => {
  let fixture: ComponentFixture<AgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AgendaComponent] }).compileComponents();
    fixture = TestBed.createComponent(AgendaComponent);
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

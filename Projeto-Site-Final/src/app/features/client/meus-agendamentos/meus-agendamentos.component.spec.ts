import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MeusAgendamentosComponent } from './meus-agendamentos.component';

describe('MeusAgendamentosComponent', () => {
  let fixture: ComponentFixture<MeusAgendamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeusAgendamentosComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(MeusAgendamentosComponent);
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

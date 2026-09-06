import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaAgendamentos } from './lista-agendamentos';

describe('ListaAgendamentos', () => {
  let component: ListaAgendamentos;
  let fixture: ComponentFixture<ListaAgendamentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAgendamentos],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaAgendamentos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ListaAgendamentosComponent } from './lista-agendamentos';

describe('ListaAgendamentosComponent', () => {
  let component: ListaAgendamentosComponent;
  let fixture: ComponentFixture<ListaAgendamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAgendamentosComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaAgendamentosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

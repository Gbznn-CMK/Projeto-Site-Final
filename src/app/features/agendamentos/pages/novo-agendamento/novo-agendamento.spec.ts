import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NovoAgendamentoComponent } from './novo-agendamento';

describe('NovoAgendamentoComponent', () => {
  let component: NovoAgendamentoComponent;
  let fixture: ComponentFixture<NovoAgendamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovoAgendamentoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NovoAgendamentoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

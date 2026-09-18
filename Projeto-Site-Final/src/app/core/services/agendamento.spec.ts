import { TestBed } from '@angular/core/testing';
import { AgendamentoService } from './agendamento';

describe('AgendamentoService', () => {
  let service: AgendamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('persists and cancels appointments', () => {
    localStorage.clear();
    const servico = { id: 1, nome: 'Corte', duracao: '30 min', preco: 'R$ 45,00' };
    const created = service.adicionarAgendamento('Studio', servico, '2026-09-10', '10:00');

    expect(service.obterAgendamentos()).toEqual([created]);
    expect(service.cancelarAgendamento(created.id)).toBe(true);
    expect(service.obterAgendamentos()[0].status).toBe('Cancelado');
    expect(service.cancelarAgendamento(999)).toBe(false);
  });
});
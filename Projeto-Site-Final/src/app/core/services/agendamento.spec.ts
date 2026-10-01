import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AgendamentoService } from './agendamento.service';
import { Agendamento } from '../models/types';

describe('AgendamentoService', () => {
  let service: AgendamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    service = TestBed.inject(AgendamentoService);
  });

  const appointment = (overrides: Partial<Agendamento> = {}): Agendamento => ({
    id: '',
    clienteId: 'user-1',
    prestadorId: 'prest-1',
    servicoId: 'serv-1',
    dataHora: '2099-09-10T10:00:00',
    duracao: 30,
    status: 'pendente',
    pagamento: 'pix',
    valor: 50,
    ...overrides,
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('creates a pending appointment and keeps it associated with the client', async () => {
    const created = await firstValueFrom(service.create(appointment()));

    expect(created.status).toBe('pendente');
    expect(await firstValueFrom(service.getByCliente('user-1'))).toEqual([created]);
  });

  it('rejects overlapping appointments for the same provider', async () => {
    await firstValueFrom(service.create(appointment()));

    await expect(firstValueFrom(service.create(appointment({ id: '', dataHora: '2099-09-10T10:15:00' }))))
      .rejects.toThrow('não está disponível');
  });

  it('allows the same time for different providers', async () => {
    await firstValueFrom(service.create(appointment()));
    const created = await firstValueFrom(service.create(appointment({ prestadorId: 'prest-2' })));

    expect(created.prestadorId).toBe('prest-2');
  });

  it('updates status and cancels only for the appointment client', async () => {
    const created = await firstValueFrom(service.create(appointment()));

    const confirmed = await firstValueFrom(service.updateStatus(created.id, 'confirmado'));
    expect(confirmed.status).toBe('confirmado');

    await expect(firstValueFrom(service.cancel(created.id, 'user-2')))
      .rejects.toThrow('Você não pode cancelar este agendamento');

    await firstValueFrom(service.cancel(created.id, 'user-1'));
    const canceled = await firstValueFrom(service.getById(created.id));
    expect(canceled?.status).toBe('cancelado');
  });
});
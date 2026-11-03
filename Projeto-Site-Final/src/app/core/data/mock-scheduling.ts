import { Agendamento, Bloqueio, Disponibilidade } from '../models/types';
import { MOCK_PRESTADORES } from './mock-providers';

// Mock Appointments (empty initially, will be populated by user actions)
export const MOCK_AGENDAMENTOS: Agendamento[] = [];
// Mock Availability (default working hours)
export const MOCK_DISPONIBILIDADES: Disponibilidade[] = [
  // Monday to Friday: 09:00-18:00 for all providers
  ...MOCK_PRESTADORES.flatMap((prest) =>
    [0, 1, 2, 3, 4].flatMap((dia) => [
      {
        id: `disp-${prest.id}-${dia}-1`,
        prestadorId: prest.id,
        diaSemana: dia,
        horaInicio: '09:00',
        horaFim: '13:00',
        ativo: true,
      },
      {
        id: `disp-${prest.id}-${dia}-2`,
        prestadorId: prest.id,
        diaSemana: dia,
        horaInicio: '14:00',
        horaFim: '18:00',
        ativo: true,
      },
    ]),
  ),
  // Saturday: 09:00-13:00
  ...MOCK_PRESTADORES.map((prest) => ({
    id: `disp-${prest.id}-5`,
    prestadorId: prest.id,
    diaSemana: 5,
    horaInicio: '09:00',
    horaFim: '13:00',
    ativo: true,
  })),
];
// Mock Blocages
export const MOCK_BLOQUEIOS: Bloqueio[] = [];

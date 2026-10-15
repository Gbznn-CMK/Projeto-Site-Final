import { Usuario } from '../models/types';
import { getLocalStorage } from '../utils/storage';
import { MOCK_USUARIOS } from './mock-users';
import { MOCK_PRESTADORES } from './mock-providers';
import { MOCK_SERVICOS } from './mock-services';
import { MOCK_AGENDAMENTOS, MOCK_DISPONIBILIDADES, MOCK_BLOQUEIOS } from './mock-scheduling';
import { MOCK_CHAMADOS } from './mock-support';

export {
  MOCK_USUARIOS,
  MOCK_PRESTADORES,
  MOCK_SERVICOS,
  MOCK_AGENDAMENTOS,
  MOCK_DISPONIBILIDADES,
  MOCK_BLOQUEIOS,
  MOCK_CHAMADOS,
};

export function initializeMockData(): void {
  const prefix = 'nahora_';
  const storage = getLocalStorage();

  if (!storage) return;

  if (storage.getItem(`${prefix}initialized`)) {
    const usersRaw = storage.getItem(`${prefix}usuarios`);
    if (usersRaw) {
      try {
        const users = JSON.parse(usersRaw) as Array<Usuario & { password?: string }>;
        const updatedUsers = users.map((user) => ({
          ...user,
          password:
            user.password ||
            MOCK_USUARIOS.find((mockUser) => mockUser.email === user.email)?.password ||
            '12345678',
        }));
        storage.setItem(`${prefix}usuarios`, JSON.stringify(updatedUsers));
      } catch {
        storage.setItem(`${prefix}usuarios`, JSON.stringify(MOCK_USUARIOS));
      }
    }
    return;
  }

  storage.setItem(`${prefix}usuarios`, JSON.stringify(MOCK_USUARIOS));
  storage.setItem(`${prefix}prestadores`, JSON.stringify(MOCK_PRESTADORES));
  storage.setItem(`${prefix}servicos`, JSON.stringify(MOCK_SERVICOS));
  storage.setItem(`${prefix}agendamentos`, JSON.stringify(MOCK_AGENDAMENTOS));
  storage.setItem(`${prefix}disponibilidades`, JSON.stringify(MOCK_DISPONIBILIDADES));
  storage.setItem(`${prefix}bloqueios`, JSON.stringify(MOCK_BLOQUEIOS));
  storage.setItem(`${prefix}chamados`, JSON.stringify(MOCK_CHAMADOS));
  storage.setItem(`${prefix}favoritos`, JSON.stringify({}));
  storage.setItem(`${prefix}initialized`, 'true');
}

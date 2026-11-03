import { Agendamento, Prestador, Usuario } from '../models/types';
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

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function parseLegacyCollection(raw: string | null): Record<string, unknown>[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed
          .map((item) => asRecord(item))
          .filter((item): item is Record<string, unknown> => item !== null)
      : [];
  } catch {
    return [];
  }
}

function normalizeLegacyUser(record: Record<string, unknown>): (Usuario & { password: string }) | null {
  const email = asString(record['email']);
  const nome = asString(record['nome']) ?? asString(record['name']);
  if (!email || !nome) return null;

  const rawTipo = (
    asString(record['tipo']) ??
    asString(record['role']) ??
    asString(record['userType']) ??
    'cliente'
  ).toLowerCase();
  const tipo =
    rawTipo === 'prestador' || rawTipo === 'provider'
      ? 'prestador'
      : rawTipo === 'profissional' || rawTipo === 'professional'
        ? 'profissional'
        : rawTipo === 'admin'
          ? 'admin'
          : 'cliente';

  return {
    id:
      asString(record['id']) ??
      asString(record['userId']) ??
      `user-legacy-${email.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    nome,
    sobrenome: asString(record['sobrenome']) ?? asString(record['lastName']),
    email,
    telefone:
      asString(record['telefone']) ??
      asString(record['phone']) ??
      asString(record['celular']) ??
      '(00) 00000-0000',
    cpf: asString(record['cpf']),
    foto: asString(record['foto']) ?? asString(record['photo']),
    tipo,
    dataCadastro: asString(record['dataCadastro']) ?? asString(record['createdAt']),
    password:
      asString(record['password']) ??
      asString(record['senha']) ??
      MOCK_USUARIOS.find((mockUser) => mockUser.email === email)?.password ??
      '12345678',
  };
}

function normalizeLegacyProvider(record: Record<string, unknown>): Prestador | null {
  const rawId = asString(record['id']) ?? asString(record['lojaId']);
  const id = rawId ? (rawId.startsWith('prest-') ? rawId : `prest-${rawId}`) : undefined;
  const nomeEstabelecimento =
    asString(record['nomeEstabelecimento']) ?? asString(record['nome']) ?? asString(record['name']);
  if (!id || !nomeEstabelecimento) return null;

  return {
    id,
    usuarioId: asString(record['usuarioId']) ?? asString(record['userId']) ?? id,
    nomeEstabelecimento,
    categoria: asString(record['categoria']) ?? asString(record['category']) ?? 'Outros',
    descricao: asString(record['descricao']) ?? asString(record['description']),
    endereco: asString(record['endereco']) ?? asString(record['address']) ?? '',
    horarioFuncionamento:
      asString(record['horarioFuncionamento']) ??
      asString(record['horario']) ??
      asString(record['businessHours']) ??
      '09:00-18:00',
    foto: asString(record['foto']) ?? asString(record['photo']),
    fotos: Array.isArray(record['fotos'])
      ? record['fotos'].filter((foto): foto is string => typeof foto === 'string')
      : undefined,
    cep: asString(record['cep']),
    latitude: asNumber(record['latitude']) ?? asNumber(record['lat']),
    longitude: asNumber(record['longitude']) ?? asNumber(record['lng']),
    dataCadastro: asString(record['dataCadastro']) ?? asString(record['createdAt']),
  };
}

function normalizeLegacyAppointment(record: Record<string, unknown>, index: number): Agendamento | null {
  const id =
    asString(record['id']) ??
    asString(record['agendamentoId']) ??
    asString(record['bookingId']) ??
    `agend-legacy-${index}`;
  const clienteId = asString(record['clienteId']) ?? asString(record['clientId']);
  const prestadorId =
    asString(record['prestadorId']) ??
    asString(record['lojaId']) ??
    asString(record['providerId']) ??
    asString(record['estabelecimentoId']);
  const servicoId = asString(record['servicoId']) ?? asString(record['serviceId']);
  const dataHora =
    asString(record['dataHora']) ??
    asString(record['data_hora']) ??
    asString(record['dateTime']) ??
    asString(record['data']);
  if (!clienteId || !prestadorId || !servicoId || !dataHora) return null;

  const rawStatus = (asString(record['status']) ?? 'pendente').toLowerCase();
  const status =
    rawStatus === 'confirmado' || rawStatus === 'confirmed'
      ? 'confirmado'
      : rawStatus === 'concluido' || rawStatus === 'completed'
        ? 'concluido'
        : rawStatus === 'cancelado' || rawStatus === 'cancelled'
          ? 'cancelado'
          : 'pendente';

  const rawPagamento = (
    asString(record['pagamento']) ??
    asString(record['paymentMethod']) ??
    'pix'
  ).toLowerCase();
  const pagamento =
    rawPagamento === 'cartao' || rawPagamento === 'card'
      ? 'cartao'
      : rawPagamento === 'dinheiro' || rawPagamento === 'cash'
        ? 'dinheiro'
        : 'pix';

  return {
    id,
    clienteId,
    prestadorId,
    profissionalId: asString(record['profissionalId']) ?? asString(record['professionalId']),
    servicoId,
    servicoNome: asString(record['servicoNome']) ?? asString(record['serviceName']),
    profissionalNome: asString(record['profissionalNome']) ?? asString(record['professionalName']),
    dataHora,
    duracao: asNumber(record['duracao']) ?? asNumber(record['duration']) ?? 60,
    status,
    pagamento,
    valor: asNumber(record['valor']) ?? asNumber(record['price']) ?? 0,
    notas: asString(record['notas']) ?? asString(record['notes']),
    clienteConfirmouConclusao:
      typeof record['clienteConfirmouConclusao'] === 'boolean'
        ? record['clienteConfirmouConclusao']
        : undefined,
    dataCadastro: asString(record['dataCadastro']) ?? asString(record['createdAt']),
  };
}

function migrateLegacyData(storage: Storage, prefix: string): void {
  const usersKey = `${prefix}usuarios`;
  const providersKey = `${prefix}prestadores`;
  const appointmentsKey = `${prefix}agendamentos`;

  if (!storage.getItem(usersKey)) {
    const migratedUsers = parseLegacyCollection(storage.getItem('nahora-users'))
      .map((record) => normalizeLegacyUser(record))
      .filter((record): record is Usuario & { password: string } => record !== null);
    if (migratedUsers.length > 0) {
      storage.setItem(usersKey, JSON.stringify(migratedUsers));
    }
  }

  if (!storage.getItem(providersKey)) {
    const migratedProviders = parseLegacyCollection(storage.getItem('nahora-lojas'))
      .map((record) => normalizeLegacyProvider(record))
      .filter((record): record is Prestador => record !== null);
    if (migratedProviders.length > 0) {
      storage.setItem(providersKey, JSON.stringify(migratedProviders));
    }
  }

  if (!storage.getItem(appointmentsKey)) {
    const migratedAppointments = parseLegacyCollection(storage.getItem('nahora-agendamentos'))
      .map((record, index) => normalizeLegacyAppointment(record, index))
      .filter((record): record is Agendamento => record !== null);
    if (migratedAppointments.length > 0) {
      storage.setItem(appointmentsKey, JSON.stringify(migratedAppointments));
    }
  }
}

export function initializeMockData(): void {
  const prefix = 'nahora_';
  const storage = getLocalStorage();

  if (!storage) return;
  migrateLegacyData(storage, prefix);

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

  if (!storage.getItem(`${prefix}usuarios`)) {
    storage.setItem(`${prefix}usuarios`, JSON.stringify(MOCK_USUARIOS));
  }
  if (!storage.getItem(`${prefix}prestadores`)) {
    storage.setItem(`${prefix}prestadores`, JSON.stringify(MOCK_PRESTADORES));
  }
  if (!storage.getItem(`${prefix}servicos`)) {
    storage.setItem(`${prefix}servicos`, JSON.stringify(MOCK_SERVICOS));
  }
  if (!storage.getItem(`${prefix}agendamentos`)) {
    storage.setItem(`${prefix}agendamentos`, JSON.stringify(MOCK_AGENDAMENTOS));
  }
  if (!storage.getItem(`${prefix}disponibilidades`)) {
    storage.setItem(`${prefix}disponibilidades`, JSON.stringify(MOCK_DISPONIBILIDADES));
  }
  if (!storage.getItem(`${prefix}bloqueios`)) {
    storage.setItem(`${prefix}bloqueios`, JSON.stringify(MOCK_BLOQUEIOS));
  }
  if (!storage.getItem(`${prefix}chamados`)) {
    storage.setItem(`${prefix}chamados`, JSON.stringify(MOCK_CHAMADOS));
  }
  if (!storage.getItem(`${prefix}favoritos`)) {
    storage.setItem(`${prefix}favoritos`, JSON.stringify({}));
  }
  storage.setItem(`${prefix}initialized`, 'true');
}

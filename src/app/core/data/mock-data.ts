import { Usuario, Prestador, Servico, Agendamento, Disponibilidade, Bloqueio, ChamadoSac, CATEGORIAS_SERVICOS } from '../models/types';
import { getLocalStorage } from '../utils/storage';

// Mock Users
export const MOCK_USUARIOS: Usuario[] = [
  {
    id: 'user-1',
    nome: 'Ana Silva',
    email: 'ana@example.com',
    telefone: '(11) 98765-4321',
    tipo: 'cliente',
    foto: 'https://i.pravatar.cc/150?u=ana',
    dataCadastro: '2026-01-01'
  },
  {
    id: 'user-2',
    nome: 'Carlos Santos',
    email: 'carlos@example.com',
    telefone: '(11) 97654-3210',
    tipo: 'cliente',
    foto: 'https://i.pravatar.cc/150?u=carlos',
    dataCadastro: '2026-01-02'
  },
  {
    id: 'prest-1',
    nome: 'João Barber',
    email: 'joao@barbearia.com',
    telefone: '(11) 95555-1111',
    tipo: 'prestador',
    foto: 'https://i.pravatar.cc/150?u=joao',
    dataCadastro: '2026-01-03'
  },
  {
    id: 'prest-2',
    nome: 'Maria Salon',
    email: 'maria@salon.com',
    telefone: '(11) 94444-2222',
    tipo: 'prestador',
    foto: 'https://i.pravatar.cc/150?u=maria',
    dataCadastro: '2026-01-04'
  },
  {
    id: 'prest-3',
    nome: 'Fernanda Nails',
    email: 'fernanda@nails.com',
    telefone: '(11) 93333-3333',
    tipo: 'prestador',
    foto: 'https://i.pravatar.cc/150?u=fernanda',
    dataCadastro: '2026-01-05'
  },
  {
    id: 'prest-4',
    nome: 'Roberto Técnico',
    email: 'roberto@tecnico.com',
    telefone: '(11) 92222-4444',
    tipo: 'prestador',
    foto: 'https://i.pravatar.cc/150?u=roberto',
    dataCadastro: '2026-01-06'
  },
  {
    id: 'prest-5',
    nome: 'Sofia Estética',
    email: 'sofia@estetica.com',
    telefone: '(11) 91111-5555',
    tipo: 'prestador',
    foto: 'https://i.pravatar.cc/150?u=sofia',
    dataCadastro: '2026-01-07'
  },
  {
    id: 'prest-6',
    nome: 'Lucas Fotógrafo',
    email: 'lucas@foto.com',
    telefone: '(11) 90000-6666',
    tipo: 'prestador',
    foto: 'https://i.pravatar.cc/150?u=lucas',
    dataCadastro: '2026-01-08'
  },
  {
    id: 'prest-7',
    nome: 'Patricia Salão 2',
    email: 'patricia@salon2.com',
    telefone: '(11) 89999-7777',
    tipo: 'prestador',
    foto: 'https://i.pravatar.cc/150?u=patricia',
    dataCadastro: '2026-01-09'
  },
  {
    id: 'prest-8',
    nome: 'Felipe Barber 2',
    email: 'felipe@barber2.com',
    telefone: '(11) 88888-8888',
    tipo: 'prestador',
    foto: 'https://i.pravatar.cc/150?u=felipe',
    dataCadastro: '2026-01-10'
  }
];

// Mock Providers
export const MOCK_PRESTADORES: Prestador[] = [
  {
    id: 'prest-1',
    usuarioId: 'prest-1',
    nomeEstabelecimento: 'Barbearia Central',
    categoria: 'Barbearia',
    descricao: 'Barbearia moderna com profissionais experientes',
    endereco: 'Rua Belterra 291, Bangu, RJ',
    horarioFuncionamento: '09:00-18:00',
    foto: 'https://images.unsplash.com/photo-1585747860715-cd4628902d4a?w=400&h=400&fit=crop',
    dataCadastro: '2026-01-03'
  },
  {
    id: 'prest-2',
    usuarioId: 'prest-2',
    nomeEstabelecimento: 'Salão da Maria',
    categoria: 'Salão de Beleza',
    descricao: 'Salão de beleza completo com corte, coloração e design',
    endereco: 'Av. Paulista 1000, São Paulo, SP',
    horarioFuncionamento: '09:00-19:00',
    foto: 'https://images.unsplash.com/photo-1633096154659-5a91e8d8fcd0?w=400&h=400&fit=crop',
    dataCadastro: '2026-01-04'
  },
  {
    id: 'prest-3',
    usuarioId: 'prest-3',
    nomeEstabelecimento: 'Nails & More',
    categoria: 'Manicure',
    descricao: 'Manicure, pedicure e design de unhas',
    endereco: 'Rua das Flores 123, Rio de Janeiro, RJ',
    horarioFuncionamento: '10:00-18:00',
    foto: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop',
    dataCadastro: '2026-01-05'
  },
  {
    id: 'prest-4',
    usuarioId: 'prest-4',
    nomeEstabelecimento: 'Tech Fix',
    categoria: 'Técnico',
    descricao: 'Manutenção e reparo de eletrônicos',
    endereco: 'Avenida Brasil 500, Belo Horizonte, MG',
    horarioFuncionamento: '08:00-17:00',
    foto: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop',
    dataCadastro: '2026-01-06'
  },
  {
    id: 'prest-5',
    usuarioId: 'prest-5',
    nomeEstabelecimento: 'Estética Sofia',
    categoria: 'Estética',
    descricao: 'Faciais, limpeza de pele e tratamentos estéticos',
    endereco: 'Rua XV de Novembro 777, Curitiba, PR',
    horarioFuncionamento: '09:00-18:00',
    foto: 'https://images.unsplash.com/photo-1560066169-b2a5efd24141?w=400&h=400&fit=crop',
    dataCadastro: '2026-01-07'
  },
  {
    id: 'prest-6',
    usuarioId: 'prest-6',
    nomeEstabelecimento: 'Fotografia Lucas',
    categoria: 'Fotógrafo',
    descricao: 'Fotografia profissional para eventos e retratos',
    endereco: 'Estúdio Centro, Brasília, DF',
    horarioFuncionamento: '10:00-20:00',
    foto: 'https://images.unsplash.com/photo-1609034227505-5876f6aa4e90?w=400&h=400&fit=crop',
    dataCadastro: '2026-01-08'
  },
  {
    id: 'prest-7',
    usuarioId: 'prest-7',
    nomeEstabelecimento: 'Salão Premium',
    categoria: 'Salão de Beleza',
    descricao: 'Salão de luxo com atendimento VIP',
    endereco: 'Rua Oscar Freire 200, São Paulo, SP',
    horarioFuncionamento: '10:00-19:00',
    foto: 'https://images.unsplash.com/photo-1521746727202-7ac7ca31dba3?w=400&h=400&fit=crop',
    dataCadastro: '2026-01-09'
  },
  {
    id: 'prest-8',
    usuarioId: 'prest-8',
    nomeEstabelecimento: 'Barber Shop Elite',
    categoria: 'Barbearia',
    descricao: 'Barbearia premium com barbeiros especialistas',
    endereco: 'Avenida Getúlio Vargas 888, Belo Horizonte, MG',
    horarioFuncionamento: '09:00-19:00',
    foto: 'https://images.unsplash.com/photo-1599599810694-200e7e124c1b?w=400&h=400&fit=crop',
    dataCadastro: '2026-01-10'
  }
];

// Mock Services
export const MOCK_SERVICOS: Servico[] = [
  // Services for prest-1 (Barbearia Central)
  {
    id: 'serv-1',
    prestadorId: 'prest-1',
    nome: 'Corte de Cabelo',
    descricao: 'Corte tradicional e moderno',
    duracaoMinutos: 30,
    preco: 50,
    ativo: true,
    dataCadastro: '2026-01-03'
  },
  {
    id: 'serv-2',
    prestadorId: 'prest-1',
    nome: 'Barba Completa',
    descricao: 'Barbear e desenhar',
    duracaoMinutos: 30,
    preco: 40,
    ativo: true,
    dataCadastro: '2026-01-03'
  },
  {
    id: 'serv-3',
    prestadorId: 'prest-1',
    nome: 'Corte + Barba',
    descricao: 'Combo: corte de cabelo e barba',
    duracaoMinutos: 60,
    preco: 80,
    ativo: true,
    dataCadastro: '2026-01-03'
  },
  // Services for prest-2 (Salão da Maria)
  {
    id: 'serv-4',
    prestadorId: 'prest-2',
    nome: 'Corte Feminino',
    descricao: 'Corte e acabamento',
    duracaoMinutos: 45,
    preco: 70,
    ativo: true,
    dataCadastro: '2026-01-04'
  },
  {
    id: 'serv-5',
    prestadorId: 'prest-2',
    nome: 'Coloração',
    descricao: 'Tinta e tratamento',
    duracaoMinutos: 90,
    preco: 150,
    ativo: true,
    dataCadastro: '2026-01-04'
  },
  {
    id: 'serv-6',
    prestadorId: 'prest-2',
    nome: 'Escova Progressiva',
    descricao: 'Alisamento progressivo profissional',
    duracaoMinutos: 120,
    preco: 200,
    ativo: true,
    dataCadastro: '2026-01-04'
  },
  // Services for prest-3 (Nails & More)
  {
    id: 'serv-7',
    prestadorId: 'prest-3',
    nome: 'Manicure Simples',
    descricao: 'Corte, lixa e esmalte',
    duracaoMinutos: 30,
    preco: 45,
    ativo: true,
    dataCadastro: '2026-01-05'
  },
  {
    id: 'serv-8',
    prestadorId: 'prest-3',
    nome: 'Pedicure',
    descricao: 'Pedicure completa',
    duracaoMinutos: 45,
    preco: 60,
    ativo: true,
    dataCadastro: '2026-01-05'
  },
  {
    id: 'serv-9',
    prestadorId: 'prest-3',
    nome: 'Manicure Gel',
    descricao: 'Gel manicure com acabamento brilhante',
    duracaoMinutos: 50,
    preco: 80,
    ativo: true,
    dataCadastro: '2026-01-05'
  },
  // Services for prest-4 (Tech Fix)
  {
    id: 'serv-10',
    prestadorId: 'prest-4',
    nome: 'Reparo de Celular',
    descricao: 'Troca de tela, bateria, etc',
    duracaoMinutos: 60,
    preco: 100,
    ativo: true,
    dataCadastro: '2026-01-06'
  },
  {
    id: 'serv-11',
    prestadorId: 'prest-4',
    nome: 'Limpeza de Notebook',
    descricao: 'Limpeza, pasta térmica',
    duracaoMinutos: 45,
    preco: 80,
    ativo: true,
    dataCadastro: '2026-01-06'
  },
  // Services for prest-5 (Estética Sofia)
  {
    id: 'serv-12',
    prestadorId: 'prest-5',
    nome: 'Limpeza de Pele',
    descricao: 'Limpeza profunda com vapor',
    duracaoMinutos: 60,
    preco: 100,
    ativo: true,
    dataCadastro: '2026-01-07'
  },
  {
    id: 'serv-13',
    prestadorId: 'prest-5',
    nome: 'Facial Hidratante',
    descricao: 'Hidratação profunda',
    duracaoMinutos: 60,
    preco: 120,
    ativo: true,
    dataCadastro: '2026-01-07'
  },
  // Services for prest-6 (Fotografia Lucas)
  {
    id: 'serv-14',
    prestadorId: 'prest-6',
    nome: 'Sessão de Retratos',
    descricao: 'Sessão de fotos profissional',
    duracaoMinutos: 120,
    preco: 300,
    ativo: true,
    dataCadastro: '2026-01-08'
  },
  {
    id: 'serv-15',
    prestadorId: 'prest-6',
    nome: 'Fotografia de Evento',
    descricao: 'Cobertura completa de evento',
    duracaoMinutos: 300,
    preco: 1500,
    ativo: true,
    dataCadastro: '2026-01-08'
  }
];

// Mock Appointments (empty initially, will be populated by user actions)
export const MOCK_AGENDAMENTOS: Agendamento[] = [];

// Mock Availability (default working hours)
export const MOCK_DISPONIBILIDADES: Disponibilidade[] = [
  // Monday to Friday: 09:00-18:00 for all providers
  ...MOCK_PRESTADORES.flatMap(prest =>
    [0, 1, 2, 3, 4].flatMap(dia =>
      [
        {
          id: `disp-${prest.id}-${dia}-1`,
          prestadorId: prest.id,
          diaSemana: dia,
          horaInicio: '09:00',
          horaFim: '13:00',
          ativo: true
        },
        {
          id: `disp-${prest.id}-${dia}-2`,
          prestadorId: prest.id,
          diaSemana: dia,
          horaInicio: '14:00',
          horaFim: '18:00',
          ativo: true
        }
      ]
    )
  ),
  // Saturday: 09:00-13:00
  ...MOCK_PRESTADORES.map(prest => ({
    id: `disp-${prest.id}-5`,
    prestadorId: prest.id,
    diaSemana: 5,
    horaInicio: '09:00',
    horaFim: '13:00',
    ativo: true
  }))
];

// Mock Blocages
export const MOCK_BLOQUEIOS: Bloqueio[] = [];

// Mock SAC Tickets
export const MOCK_CHAMADOS: ChamadoSac[] = [];

// Function to initialize mock data to localStorage
export function initializeMockData() {
  const prefix = 'nahora_';
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }
  
  // Only initialize if not already done
  if (storage.getItem(`${prefix}initialized`)) {
    return;
  }

  storage.setItem(`${prefix}usuarios`, JSON.stringify(MOCK_USUARIOS));
  storage.setItem(`${prefix}prestadores`, JSON.stringify(MOCK_PRESTADORES));
  storage.setItem(`${prefix}servicos`, JSON.stringify(MOCK_SERVICOS));
  storage.setItem(`${prefix}agendamentos`, JSON.stringify(MOCK_AGENDAMENTOS));
  storage.setItem(`${prefix}disponibilidades`, JSON.stringify(MOCK_DISPONIBILIDADES));
  storage.setItem(`${prefix}bloqueios`, JSON.stringify(MOCK_BLOQUEIOS));
  storage.setItem(`${prefix}chamados`, JSON.stringify(MOCK_CHAMADOS));
  storage.setItem(`${prefix}favoritos`, JSON.stringify({})); // userId -> [prestadorIds]
  
  storage.setItem(`${prefix}initialized`, 'true');
}

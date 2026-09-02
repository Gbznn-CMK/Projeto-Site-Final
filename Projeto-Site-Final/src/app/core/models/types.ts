// User types
export type TipoUsuario = 'cliente' | 'prestador' | 'admin';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: TipoUsuario;
  foto?: string;
  dataCadastro?: string;
}

// Provider types
export interface Prestador {
  id: string;
  usuarioId: string;
  nomeEstabelecimento: string;
  categoria: string;
  descricao?: string;
  endereco: string;
  horarioFuncionamento: string; // e.g., "09:00-18:00"
  foto?: string;
  dataCadastro?: string;
}

// Service types
export interface Servico {
  id: string;
  prestadorId: string;
  nome: string;
  descricao: string;
  duracaoMinutos: number;
  preco: number;
  ativo: boolean;
  dataCadastro?: string;
}

// Appointment types
export type StatusAgendamento =
  | 'pendente'
  | 'confirmado'
  | 'concluido'
  | 'cancelado';

export type MetodoPagamento = 'pix' | 'cartao' | 'dinheiro';

export interface Agendamento {
  id: string;
  clienteId: string;
  prestadorId: string;
  servicoId: string;
  dataHora: string; // ISO 8601 format
  duracao: number; // minutes
  status: StatusAgendamento;
  pagamento: MetodoPagamento;
  valor: number;
  notas?: string;
  dataCadastro?: string;
}

// Availability types
export interface Disponibilidade {
  id: string;
  prestadorId: string;
  diaSemana: number; // 0-6 (Mon-Sun)
  horaInicio: string; // "09:00"
  horaFim: string; // "18:00"
  ativo: boolean;
}

export interface Bloqueio {
  id: string;
  prestadorId: string;
  dataHora: string; // ISO 8601 format
  duracao: number; // minutes
  motivo?: string;
  dataCadastro?: string;
}

// Support/SAC types
export type StatusChamado = 'aberto' | 'em_andamento' | 'resolvido';

export interface ChamadoSac {
  id: string;
  usuarioId: string;
  assunto: string;
  mensagem: string;
  status: StatusChamado;
  resposta?: string;
  dataCadastro?: string;
  dataResolucao?: string;
}

// Authentication types
export interface AuthResponse {
  usuario: Usuario;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CadastroRequest {
  nome: string;
  email: string;
  password: string;
  telefone: string;
  tipo: TipoUsuario;
  // For prestador type
  nomeEstabelecimento?: string;
  categoria?: string;
  endereco?: string;
  horarioFuncionamento?: string;
}

// Time slot interface
export interface TimeSlot {
  hora: string; // "09:00", "09:30", etc.
  disponivel: boolean;
}

// Category constants
export const CATEGORIAS_SERVICOS = [
  'Barbearia',
  'Salão de Beleza',
  'Manicure',
  'Pedicure',
  'Estética',
  'Técnico',
  'Fotógrafo',
  'Autônomo',
  'Outros'
];

export const DIAS_SEMANA = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo'
];

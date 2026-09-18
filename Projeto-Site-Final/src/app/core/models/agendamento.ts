export interface Servico {
  id: number;
  nome: string;
  duracao: string;
  preco: string;
}

export interface Loja {
  id: number;
  nome: string;
  endereco: string;
  horario: string;
  disponivel: boolean;
  imagemUrl: string;
}

export interface Agendamento {
  id: number;
  empresa: string;
  servico: string;
  data: string;
  horario: string;
  valor: string;
  status: 'Pendente' | 'Confirmado' | 'Cancelado';
}
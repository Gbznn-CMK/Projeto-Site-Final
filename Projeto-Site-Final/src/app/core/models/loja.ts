export interface ServicoLoja {
  id: number;
  nome: string;
  categoria: string;
  duracao: number;
  valor: number;
  descricao: string;
  ativo: boolean;
}

export interface Loja {
  id: number;
  proprietarioEmail: string;
  nome: string;
  categoria: string;
  endereco: string;
  cep?: string;
  horario: string;
  imagemUrl: string;
  fotos?: string[];
  latitude?: number;
  longitude?: number;
  disponivel: boolean;
  servicos: ServicoLoja[];
}

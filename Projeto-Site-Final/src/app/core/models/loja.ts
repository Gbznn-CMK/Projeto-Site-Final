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
  horario: string;
  imagemUrl: string;
  disponivel: boolean;
  servicos: ServicoLoja[];
}

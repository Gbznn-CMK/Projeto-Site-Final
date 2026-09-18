import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AgendamentoService } from '../../../../core/services/agendamento';
import { Servico } from '../../../../core/models/agendamento';
import { LojaService } from '../../../../core/services/loja';

@Component({
  selector: 'app-novo-agendamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './novo-agendamento.html',
  styleUrls: ['./novo-agendamento.css']
})
export class NovoAgendamentoComponent implements OnInit {
  passoAtual: number = 2;

  private readonly servicosPorCategoria: Record<string, Servico[]> = {
    Barbearia: [
    { id: 1, nome: 'Corte Completo', duracao: '30 min', preco: 'R$ 45,00' },
    { id: 2, nome: 'Barba e Toalha Quente', duracao: '30 min', preco: 'R$ 35,00' },
    { id: 3, nome: 'Combo Cabelo + Barba', duracao: '50 min', preco: 'R$ 70,00' }
    ],
    'Salão de Beleza': [
      { id: 4, nome: 'Escova e finalização', duracao: '45 min', preco: 'R$ 60,00' },
      { id: 5, nome: 'Corte feminino', duracao: '60 min', preco: 'R$ 90,00' },
    ],
    Manicure: [
      { id: 6, nome: 'Manicure e pedicure', duracao: '60 min', preco: 'R$ 80,00' },
      { id: 7, nome: 'Alongamento de unhas', duracao: '90 min', preco: 'R$ 120,00' },
    ],
    'Personal Trainer': [
      { id: 8, nome: 'Treino personalizado', duracao: '60 min', preco: 'R$ 90,00' },
      { id: 9, nome: 'Avaliação física', duracao: '45 min', preco: 'R$ 70,00' },
    ],
  };

  servicosDisponiveis: Servico[] = this.servicosPorCategoria['Barbearia'];

  servicoSelecionado: Servico | null = null;
  dataSelecionada = '';
  horarioSelecionado = '';
  erroDataHora = '';
  estabelecimento = 'Barbearia Central';
  categoriaEstabelecimento = 'Barbearia';

  constructor(
    public agendamentoService: AgendamentoService,
    private router: Router,
    @Optional() private route: ActivatedRoute | null,
  ) {}

  private readonly lojaService = inject(LojaService);

  ngOnInit(): void {
    const prestadorId = Number(this.route?.snapshot.queryParamMap.get('prestador') ?? 1);
    const prestador = this.obterPrestador(prestadorId);
    this.estabelecimento = prestador.nome;
    this.categoriaEstabelecimento = prestador.categoria;
    this.servicosDisponiveis = this.servicosPorCategoria[prestador.categoria] ?? this.servicosPorCategoria['Barbearia'];

    const loja = this.lojaService.obterPorId(prestadorId);
    if (loja) {
      const servicos = this.lojaService.listarServicos(loja.id);
      this.servicosDisponiveis = servicos.length
        ? servicos.map((servico) => ({
          id: servico.id,
          nome: servico.nome,
          duracao: `${servico.duracao} min`,
          preco: servico.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        }))
        : [{
          id: loja.id,
          nome: 'Atendimento personalizado',
          duracao: '60 min',
          preco: 'A combinar',
        }];
    }
  }

  get dataMinima(): string {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  selecionarServico(servico: Servico) {
    this.servicoSelecionado = servico;
    this.passoAtual = 3;
  }

  confirmarDataHora(data: string, horario: string): void {
    if (!data || !horario) {
      this.erroDataHora = 'Selecione uma data e um horário para continuar.';
      return;
    }

    const agora = new Date();
    const dataHora = new Date(`${data}T${horario}`);
    if (Number.isNaN(dataHora.getTime()) || dataHora <= agora) {
      this.erroDataHora = 'Escolha um horário futuro. Horários passados não estão disponíveis.';
      return;
    }

    this.dataSelecionada = data;
    this.horarioSelecionado = horario;
    this.erroDataHora = '';
    this.passoAtual = 4;
  }

  finalizarAgendamento(): void {
    if (!this.servicoSelecionado || !this.dataSelecionada || !this.horarioSelecionado) {
      return;
    }

    this.agendamentoService.adicionarAgendamento(
      this.estabelecimento,
      this.servicoSelecionado,
      this.dataSelecionada,
      this.horarioSelecionado
    );
    this.passoAtual = 5;
  }

  reiniciar() {
    this.passoAtual = 2;
    this.servicoSelecionado = null;
    this.dataSelecionada = '';
    this.horarioSelecionado = '';
    this.erroDataHora = '';
  }

  voltarParaHome(): void {
    void this.router.navigate(['/home-cliente']);
  }

  verAgendamentos(): void {
    void this.router.navigate(['/agendamentos']);
  }

  private obterPrestador(id: number): { nome: string; categoria: string } {
    const prestadores: Record<number, { nome: string; categoria: string }> = {
      1: { nome: 'Barbearia Central', categoria: 'Barbearia' },
      2: { nome: 'Salão da Maria', categoria: 'Salão de Beleza' },
      3: { nome: 'Nails & More', categoria: 'Manicure' },
      4: { nome: 'Studio Fit', categoria: 'Personal Trainer' },
    };
    const loja = this.lojaService.obterPorId(id);
    return loja
      ? { nome: loja.nome, categoria: loja.categoria }
      : prestadores[id] ?? prestadores[1];
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChamadoSac, StatusChamado, Usuario } from '../../../core/models/types';
import { AuthService } from '../../../core/services/auth.service';
import { SacService } from '../../../core/services/sac.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { DateTimePipe } from '../../../shared/pipes/formatting.pipes';

@Component({
  selector: 'app-sac',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, DateTimePipe],
  templateUrl: './sac.component.html',
  styleUrl: './sac.component.css',
})
export class SacComponent implements OnInit {
  tickets: ChamadoSac[] = [];
  filteredTickets: ChamadoSac[] = [];
  filters = [
    { label: 'Todos', value: 'todos' },
    { label: 'Abertos', value: 'aberto' },
    { label: 'Em andamento', value: 'em_andamento' },
    { label: 'Resolvidos', value: 'resolvido' },
  ];
  filter = 'todos';
  subject = '';
  message = '';
  showForm = false;
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  private userId = '';

  constructor(
    private authService: AuthService,
    private sacService: SacService,
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: Usuario | null) => {
      if (user) {
        this.userId = user.id;
        this.loadTickets();
      } else this.loading = false;
    });
  }
  private loadTickets() {
    this.sacService.getChamados(this.userId).subscribe({
      next: (tickets) => {
        this.tickets = tickets.sort(
          (a, b) =>
            new Date(b.dataCadastro || '').getTime() - new Date(a.dataCadastro || '').getTime(),
        );
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os chamados.';
        this.loading = false;
      },
    });
  }
  setFilter(value: string) {
    this.filter = value;
    this.applyFilter();
  }
  private applyFilter() {
    this.filteredTickets =
      this.filter === 'todos'
        ? this.tickets
        : this.tickets.filter((ticket) => ticket.status === this.filter);
  }
  createTicket() {
    if (!this.subject.trim() || !this.message.trim() || !this.userId) return;
    this.saving = true;
    this.sacService.criarChamado(this.userId, this.subject.trim(), this.message.trim()).subscribe({
      next: (ticket) => {
        this.tickets = [ticket, ...this.tickets];
        this.applyFilter();
        this.subject = '';
        this.message = '';
        this.showForm = false;
        this.successMessage = 'Chamado enviado com sucesso.';
        this.saving = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível enviar o chamado.';
        this.saving = false;
      },
    });
  }
}

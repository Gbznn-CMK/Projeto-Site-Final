import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { NovoAgendamentoComponent } from './app/features/agendamentos/pages/novo-agendamento/novo-agendamento';

bootstrapApplication(NovoAgendamentoComponent, appConfig)
  .catch((err) => console.error(err));
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    @if (open) {
      <div class="backdrop" role="presentation" (click)="cancel.emit()">
        <section class="modal" role="dialog" aria-modal="true" [attr.aria-labelledby]="titleId" (click)="$event.stopPropagation()">
          <h2 [id]="titleId">{{ title }}</h2>
          <p>{{ message }}</p>
          <div class="actions">
            <button type="button" class="secondary" (click)="cancel.emit()">Cancelar</button>
            <button type="button" class="primary" (click)="confirmed.emit()">Confirmar</button>
          </div>
        </section>
      </div>
    }
  `,
  styles: [`
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: rgb(15 23 42 / 55%);
    }
    .modal {
      width: min(100%, 420px);
      padding: 1.5rem;
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 1rem 3rem rgb(15 23 42 / 25%);
    }
    h2 { margin: 0 0 .75rem; }
    p { margin: 0; color: var(--color-neutral-600, #5d6675); }
    .actions { display: flex; justify-content: flex-end; gap: .75rem; margin-top: 1.5rem; }
    button { padding: .625rem 1rem; border: 0; border-radius: .5rem; font: inherit; cursor: pointer; }
    .secondary { color: var(--color-neutral-800, #263044); background: var(--color-neutral-100, #eef1f5); }
    .primary { color: #fff; background: var(--color-primary, #2f6fed); }
  `],
})
export class ConfirmModalComponent {
  @Input() open = false;
  @Input() title = 'Confirmar ação';
  @Input() message = 'Deseja continuar?';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get titleId(): string {
    return 'confirm-modal-title';
  }
}

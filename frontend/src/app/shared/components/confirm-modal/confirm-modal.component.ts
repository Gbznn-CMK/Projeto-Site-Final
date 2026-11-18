import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css',
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

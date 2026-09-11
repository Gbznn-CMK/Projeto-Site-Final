import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2 class="modal-title">{{ title }}</h2>
        <p class="modal-message">{{ message }}</p>
        
        <div class="modal-actions">
          <button class="btn btn-secondary" (click)="onCancel()">
            {{ cancelText }}
          </button>
          <button class="btn btn-primary" (click)="onConfirm()">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal);
    }

    .modal-content {
      background-color: white;
      border-radius: var(--radius-lg);
      padding: var(--space-2xl);
      max-width: 400px;
      width: 90%;
      box-shadow: var(--shadow-xl);
    }

    .modal-title {
      margin-bottom: var(--space-md);
      color: var(--color-neutral-900);
    }

    .modal-message {
      color: var(--color-neutral-600);
      margin-bottom: var(--space-2xl);
    }

    .modal-actions {
      display: flex;
      gap: var(--space-md);
      justify-content: flex-end;
    }

    .btn {
      padding: var(--space-sm) var(--space-lg);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: var(--font-weight-semibold);
      transition: all var(--transition-base);
    }

    .btn-secondary {
      background-color: var(--color-neutral-200);
      color: var(--color-neutral-900);
    }

    .btn-secondary:hover {
      background-color: var(--color-neutral-300);
    }

    .btn-primary {
      background-color: var(--color-primary);
      color: white;
    }

    .btn-primary:hover {
      background-color: var(--color-primary-light);
    }
  `]
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar';
  @Input() message = 'Tem certeza?';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
    this.isOpen = false;
  }

  onCancel() {
    this.cancelled.emit();
    this.isOpen = false;
  }
}

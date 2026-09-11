import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Prestador } from '../../../core/models/types';

@Component({
  selector: 'app-provider-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card provider-card">
      <div class="card-image">
        <img [src]="provider.foto || '/favicon.ico'" [alt]="provider.nomeEstabelecimento">
        <button 
          class="favorite-btn" 
          [class.favorited]="isFavorited"
          (click)="toggleFavorite()"
        >
          {{ isFavorited ? '⭐' : '☆' }}
        </button>
      </div>

      <div class="card-content">
        <h3 class="provider-name">{{ provider.nomeEstabelecimento }}</h3>
        <p class="provider-category">{{ provider.categoria }}</p>
        
        <div class="provider-info">
          <p class="info-item">
            <span class="icon">📍</span>
            <span>{{ provider.endereco }}</span>
          </p>
          <p class="info-item">
            <span class="icon">⏰</span>
            <span>{{ provider.horarioFuncionamento }}</span>
          </p>
        </div>

        <div class="rating">
          <span class="stars">★★★★☆</span>
          <span class="rating-value">4.5/5</span>
        </div>

        <div class="card-actions">
          <button 
            [routerLink]="['/prestador', provider.id]"
            class="btn btn-secondary"
          >
            Ver Perfil
          </button>
          <button 
            [routerLink]="['/agendar', provider.id]"
            class="btn btn-primary"
            [disabled]="!isAvailable"
          >
            {{ isAvailable ? 'Agendar' : 'Indisponível' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: white;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid var(--color-neutral-200);
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-base);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-4px);
    }

    .card-image {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      background-color: var(--color-neutral-200);
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .favorite-btn {
      position: absolute;
      top: var(--space-md);
      right: var(--space-md);
      background-color: rgba(255, 255, 255, 0.9);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-base);
    }

    .favorite-btn:hover {
      background-color: white;
      transform: scale(1.1);
    }

    .favorite-btn.favorited {
      color: var(--color-warning);
    }

    .card-content {
      padding: var(--space-lg);
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .provider-name {
      margin: 0 0 var(--space-xs) 0;
      font-size: var(--font-size-lg);
      color: var(--color-neutral-900);
    }

    .provider-category {
      margin: 0 0 var(--space-md) 0;
      font-size: var(--font-size-sm);
      color: var(--color-primary);
      font-weight: var(--font-weight-semibold);
    }

    .provider-info {
      flex: 1;
      margin-bottom: var(--space-md);
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-sm);
      margin-bottom: var(--space-sm);
      font-size: var(--font-size-sm);
      color: var(--color-neutral-600);
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .icon {
      flex-shrink: 0;
      margin-top: 2px;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      margin-bottom: var(--space-lg);
      font-size: var(--font-size-sm);
    }

    .stars {
      color: var(--color-warning);
    }

    .rating-value {
      color: var(--color-neutral-600);
      font-weight: var(--font-weight-semibold);
    }

    .card-actions {
      display: flex;
      gap: var(--space-md);
    }

    .btn {
      flex: 1;
      padding: var(--space-sm) var(--space-md);
      border: none;
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-base);
      text-decoration: none;
      display: inline-block;
      text-align: center;
      font-size: var(--font-size-sm);
    }

    .btn-primary {
      background-color: var(--color-primary);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-primary-light);
    }

    .btn-primary:disabled {
      background-color: var(--color-neutral-300);
      color: var(--color-neutral-600);
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: var(--color-neutral-200);
      color: var(--color-neutral-900);
    }

    .btn-secondary:hover {
      background-color: var(--color-neutral-300);
    }
  `]
})
export class ProviderCardComponent {
  @Input() provider!: Prestador;
  @Input() isFavorited = false;
  @Input() isAvailable = true;
  
  @Output() toggleFav = new EventEmitter<void>();

  toggleFavorite(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.toggleFav.emit();
  }
}

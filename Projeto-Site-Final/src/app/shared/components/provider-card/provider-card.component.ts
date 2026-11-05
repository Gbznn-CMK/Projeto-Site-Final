import { Component, Input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface ProviderCardData {
  id: string | number;
  name: string;
  image: string;
  category: string;
  address: string;
  hours: string;
  rating: string;
  stars: string;
}

@Component({
  selector: 'app-provider-card',
  imports: [RouterLink],
  templateUrl: './provider-card.component.html',
  styleUrl: './provider-card.component.css',
})
export class ProviderCardComponent {
  @Input({ required: true }) provider!: ProviderCardData;
  @Input() favorite = false;

  readonly favoriteChange = output<boolean>();
  readonly profileSelect = output<ProviderCardData>();

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoriteChange.emit(!this.favorite);
  }

  selectProfile(): void {
    this.profileSelect.emit(this.provider);
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-professional-home',
  imports: [RouterLink],
  templateUrl: './professional-home.component.html',
  styleUrl: './professional-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalHome {}

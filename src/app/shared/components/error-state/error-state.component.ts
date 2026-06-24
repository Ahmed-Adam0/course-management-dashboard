import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.css'
})
export class ErrorStateComponent {
  @Input() title: string = 'An error occurred';
  @Input() message: string = 'Failed to load courses. Please make sure the JSON Mock Server is running on port 3000.';
  @Output() retry = new EventEmitter<void>();

  public translate = inject(TranslationService);

  onRetry(): void {
    this.retry.emit();
  }
}

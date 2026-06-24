import { Component, EventEmitter, Output, input, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Course } from '../../models/course.model';
import { CourseStatus } from '../../models/course-status.enum';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})
export class CourseCardComponent {
  course = input.required<Course>();
  public translate = inject(TranslationService);

  @Output() view = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<Course>();

  getStatusClass(status: CourseStatus): string {
    switch (status) {
      case CourseStatus.Active:
        return 'status-active';
      case CourseStatus.Draft:
        return 'status-draft';
      case CourseStatus.Archived:
        return 'status-archived';
      default:
        return '';
    }
  }
}

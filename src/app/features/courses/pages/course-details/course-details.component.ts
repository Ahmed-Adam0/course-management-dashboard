import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { CourseStatus } from '../../models/course-status.enum';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    ErrorStateComponent,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  public translate = inject(TranslationService);

  id = signal<string>('');

  course = signal<Course | null>(null);
  loading = signal<boolean>(true);
  error = signal<boolean>(false);

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id') || '';
    this.id.set(courseId);
    this.loadCourseDetails();
  }

  loadCourseDetails(): void {
    this.loading.set(true);
    this.error.set(false);

    this.courseService.getCourseById(this.id()).subscribe({
      next: (course) => {
        this.course.set(course);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  getStatusClass(status: CourseStatus | undefined): string {
    if (!status) return '';
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

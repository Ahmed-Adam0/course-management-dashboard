import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CourseService } from '../../services/course.service';
import { CATEGORIES } from '../../../../shared/constants/categories';
import { COURSE_STATUS_OPTIONS } from '../../../../shared/constants/course-status-options';
import { CourseStatus } from '../../models/course-status.enum';
import { TranslationService } from '../../../../core/services/translation.service';
import { HasUnsavedChanges } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.css'
})
export class CourseFormComponent implements OnInit, HasUnsavedChanges {
  private fb = inject(NonNullableFormBuilder);
  private courseService = inject(CourseService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  public translate = inject(TranslationService);

  id = signal<string | undefined>(undefined);

  isEditMode = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);

  readonly categories = CATEGORIES;
  readonly statusOptions = COURSE_STATUS_OPTIONS;

  // Modern non-nullable typed reactive form configuration
  courseForm = this.fb.group({
    courseName: ['', [Validators.required, Validators.minLength(3)]],
    instructorName: ['', [Validators.required]],
    category: ['', [Validators.required]],
    duration: [null as number | null, [Validators.required, Validators.min(0.001)]],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    status: [CourseStatus.Draft as CourseStatus, [Validators.required]],
    description: ['', [Validators.maxLength(500)]]
  });

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.id.set(courseId);
      this.isEditMode.set(true);
      this.loadCourse(courseId);
    }
  }

  loadCourse(courseId: string): void {
    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        // Populate the form fields with returned course details
        this.courseForm.patchValue({
          courseName: course.courseName,
          instructorName: course.instructorName,
          category: course.category,
          duration: course.duration,
          price: course.price,
          status: course.status,
          description: course.description ?? ''
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open(this.translate.get('toast_load_details_err'), 'Close', {
          duration: 3000
        });
        this.router.navigate(['/courses']);
      }
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      return;
    }

    const formValues = this.courseForm.getRawValue();
    // Ensure duration and price are numbers
    const payload = {
      courseName: formValues.courseName,
      instructorName: formValues.instructorName,
      category: formValues.category,
      duration: formValues.duration ?? 0,
      price: formValues.price ?? 0,
      status: formValues.status,
      description: formValues.description
    };

    if (this.isEditMode() && this.id()) {
      // Fetch details first to retain original date or allow service/server overwrite
      this.courseService.getCourseById(this.id()!).subscribe({
        next: (existing) => {
          const updatePayload = {
            ...payload,
            id: existing.id,
            createdDate: existing.createdDate
          };
          this.courseService.updateCourse(this.id()!, updatePayload).subscribe({
            next: () => {
              this.isSubmitted.set(true);
              this.snackBar.open(this.translate.get('toast_updated'), 'Close', { duration: 3000 });
              this.router.navigate(['/courses']);
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open(this.translate.get('toast_update_err'), 'Close', { duration: 3000 });
            }
          });
        }
      });
    } else {
      this.courseService.addCourse(payload).subscribe({
        next: () => {
          this.isSubmitted.set(true);
          this.snackBar.open(this.translate.get('toast_created'), 'Close', { duration: 3000 });
          this.router.navigate(['/courses']);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open(this.translate.get('toast_create_err'), 'Close', { duration: 3000 });
        }
      });
    }
  }

  hasUnsavedChanges(): boolean {
    return this.courseForm.dirty && !this.isSubmitted();
  }
}

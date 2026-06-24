import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { COURSE_STATUS_OPTIONS } from '../../../../shared/constants/course-status-options';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-course-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './course-filter.component.html',
  styleUrl: './course-filter.component.css'
})
export class CourseFilterComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  public translate = inject(TranslationService);
  readonly statusOptions = COURSE_STATUS_OPTIONS;

  @Output() filterChanged = new EventEmitter<{ name: string; status: string }>();

  filterForm = this.fb.group({
    name: [''],
    status: ['']
  });

  constructor() {
    // Detect value changes, debounce keystrokes, and emit filter parameters reactively
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => prev.name === curr.name && prev.status === curr.status),
        takeUntilDestroyed()
      )
      .subscribe((values) => {
        this.filterChanged.emit({
          name: values.name ?? '',
          status: values.status ?? ''
        });
      });
  }

  ngOnInit(): void {}

  resetFilters(): void {
    this.filterForm.setValue({
      name: '',
      status: ''
    });
  }
}

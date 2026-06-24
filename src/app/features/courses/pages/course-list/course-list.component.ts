import { Component, OnInit, signal, computed, inject, DestroyRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { CourseFilterComponent } from '../../components/course-filter/course-filter.component';
import { CourseTableComponent } from '../../components/course-table/course-table.component';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { TranslationService } from '../../../../core/services/translation.service';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    RouterLink,
    MatSnackBarModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CourseFilterComponent,
    CourseTableComponent,
    CourseCardComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    SkeletonLoaderComponent,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);
  public translate = inject(TranslationService);

  @ViewChild('paginator') paginatorComponent!: MatPaginator;

  // Component Reactivity States (Signals)
  courses = signal<Course[]>([]);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);
  isMobile = signal<boolean>(false);

  // Search parameters
  filterName = signal<string>('');
  filterStatus = signal<string>('');

  // Client-Side Pagination States
  pageIndex = signal<number>(0);
  pageSize = signal<number>(5);

  totalPages = computed(() => Math.ceil(this.courses().length / this.pageSize()));

  // Computed paged list (automatically updates when page, size or courses changes)
  pagedCourses = computed(() => {
    const list = this.courses();
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    // For mobile responsive card lists, slice the data locally
    // (Table view has its own internal dataSource, but we pass data similarly or slice)
    if (this.isMobile()) {
      return list.slice(start, end);
    }
    return list.slice(start, end);
  });

  ngOnInit(): void {
    // Monitor screen sizes for responsive rendering
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });

    this.loadCourses();
  }

  loadCourses(): void {
    this.loading.set(true);
    this.error.set(false);

    const filters = {
      name: this.filterName(),
      status: this.filterStatus()
    };

    this.courseService.getCourses(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.courses.set(data);
          this.loading.set(false);
          // Reset page index on reload to avoid out of bounds
          this.pageIndex.set(0);
        },
        error: (err) => {
          console.error(err);
          this.error.set(true);
          this.loading.set(false);
          this.snackBar.open(this.translate.get('state_error_msg'), 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  onFilterChanged(filters: { name: string; status: string }): void {
    this.filterName.set(filters.name);
    this.filterStatus.set(filters.status);
    this.loadCourses();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPagesArray(): number[] {
    const total = this.totalPages();
    const arr = [];
    for (let i = 0; i < total; i++) {
      arr.push(i);
    }
    return arr;
  }

  goToPage(page: number): void {
    this.pageIndex.set(page);
    if (this.paginatorComponent) {
      this.paginatorComponent.pageIndex = page;
      this.paginatorComponent.page.emit({
        pageIndex: page,
        pageSize: this.pageSize(),
        length: this.courses().length
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.pageIndex.set(0);
    if (this.paginatorComponent) {
      this.paginatorComponent.pageSize = size;
      this.paginatorComponent.pageIndex = 0;
      this.paginatorComponent.page.emit({
        pageIndex: 0,
        pageSize: size,
        length: this.courses().length
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onViewDetails(id: string): void {
    this.router.navigate(['/courses/details', id]);
  }

  onEditCourse(id: string): void {
    this.router.navigate(['/courses/edit', id]);
  }

  onDeleteCourse(course: Course): void {
    // Open confirmation dialog
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: { courseName: course.courseName }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.courseService.deleteCourse(course.id).subscribe({
          next: () => {
            this.snackBar.open(this.translate.get('toast_deleted'), 'Close', {
              duration: 3000
            });
            this.loadCourses();
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open(this.translate.get('toast_delete_err'), 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }
}

import { Component, EventEmitter, Output, ViewChild, effect, input, AfterViewInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { Course } from '../../models/course.model';
import { CourseStatus } from '../../models/course-status.enum';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-course-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './course-table.component.html',
  styleUrl: './course-table.component.css'
})
export class CourseTableComponent implements AfterViewInit {
  courses = input.required<Course[]>();
  paginator = input<MatPaginator>();
  public translate = inject(TranslationService);

  @Output() view = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<Course>();

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Course>([]);
  displayedColumns: string[] = [
    'courseName',
    'instructorName',
    'category',
    'duration',
    'price',
    'status',
    'createdDate',
    'actions'
  ];

  constructor() {
    // Dynamically update the material table data source when the reactive signal-based input changes
    effect(() => {
      this.dataSource.data = this.courses();
    });

    effect(() => {
      const p = this.paginator();
      if (p) {
        this.dataSource.paginator = p;
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

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

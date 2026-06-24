import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CourseFilterComponent } from './course-filter.component';
import { TranslationService } from '../../../../core/services/translation.service';

describe('CourseFilterComponent', () => {
  let component: CourseFilterComponent;
  let fixture: ComponentFixture<CourseFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        CourseFilterComponent
      ],
      providers: [TranslationService]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize filter form with empty fields', () => {
    expect(component.filterForm.value).toEqual({ name: '', status: '' });
  });

  it('should emit filter values reactively after debounce time', fakeAsync(() => {
    spyOn(component.filterChanged, 'emit');

    component.filterForm.patchValue({ name: 'Angular', status: 'Active' });
    fixture.detectChanges();

    // Verify it doesn't emit immediately (before 300ms)
    tick(100);
    expect(component.filterChanged.emit).not.toHaveBeenCalled();

    // Tick remaining time
    tick(250);
    expect(component.filterChanged.emit).toHaveBeenCalledWith({ name: 'Angular', status: 'Active' });
  }));

  it('should reset filters on calling resetFilters', () => {
    component.filterForm.patchValue({ name: 'React', status: 'Draft' });
    expect(component.filterForm.value).toEqual({ name: 'React', status: 'Draft' });

    component.resetFilters();
    expect(component.filterForm.value).toEqual({ name: '', status: '' });
  });
});
export default CourseFilterComponent;

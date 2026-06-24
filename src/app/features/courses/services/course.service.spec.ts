import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CourseService } from './course.service';
import { Course } from '../models/course.model';
import { CourseStatus } from '../models/course-status.enum';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  const mockCourses: Course[] = [
    {
      id: '1',
      courseName: 'Angular Fundamentals',
      instructorName: 'Ahmed Ali',
      category: 'Frontend',
      duration: 20,
      price: 1500,
      status: CourseStatus.Active,
      createdDate: '2026-06-01',
      description: 'Learn fundamentals.'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourseService]
    });
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch courses via HTTP GET when server is online', () => {
    service.getCourses().subscribe(courses => {
      expect(courses.length).toBe(1);
      expect(courses[0].courseName).toBe('Angular Fundamentals');
    });

    const req = httpMock.expectOne('http://localhost:3000/courses');
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);
  });

  it('should fall back to localStorage if HTTP GET fails with status 0', () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('courses', JSON.stringify(mockCourses));
    }

    service.getCourses().subscribe(courses => {
      expect(courses.length).toBe(1);
      expect(courses[0].courseName).toBe('Angular Fundamentals');
    });

    const req = httpMock.expectOne('http://localhost:3000/courses');
    req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
  });

  it('should add a course successfully', () => {
    const newCourseInput = {
      courseName: 'Vue Basics',
      instructorName: 'Sara Ali',
      category: 'Frontend',
      duration: 10,
      price: 500,
      status: CourseStatus.Draft,
      description: 'Vue intro'
    };

    service.addCourse(newCourseInput).subscribe(course => {
      expect(course.id).toBeDefined();
      expect(course.courseName).toBe('Vue Basics');
    });

    const req = httpMock.expectOne('http://localhost:3000/courses');
    expect(req.request.method).toBe('POST');
    req.flush({ ...newCourseInput, id: '11', createdDate: '2026-06-24' });
  });
});
export default CourseService;

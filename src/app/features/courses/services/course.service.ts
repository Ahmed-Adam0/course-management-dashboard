import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Course } from '../models/course.model';
import { CourseStatus } from '../models/course-status.enum';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/courses';

  // State to track if we should fall back to Local Storage CRUD
  private isLocalStorageMode = false;

  // Initial seed data to load when Local Storage is empty
  private readonly SEED_COURSES: Course[] = [
    {
      id: '1',
      courseName: 'Angular Fundamentals',
      instructorName: 'Ahmed Ali',
      category: 'Frontend',
      duration: 20,
      price: 1500,
      status: CourseStatus.Active,
      createdDate: '2026-06-01',
      description: 'Learn the absolute basics of Angular, including components, data binding, directives, and building standalone web applications from scratch.'
    },
    {
      id: '2',
      courseName: 'NestJS Advanced Patterns',
      instructorName: 'Moustafa Sayed',
      category: 'Backend',
      duration: 35,
      price: 2400,
      status: CourseStatus.Active,
      createdDate: '2026-05-15',
      description: 'Master advanced architectural patterns in NestJS, including Microservices, CQRS, custom decorators, and database integrations.'
    },
    {
      id: '3',
      courseName: 'UI/UX Design Essentials',
      instructorName: 'Sara Mahmoud',
      category: 'Design',
      duration: 15,
      price: 999,
      status: CourseStatus.Draft,
      createdDate: '2026-06-10',
      description: 'An introductory guide to design thinking, low-fidelity wireframing, high-fidelity prototypes, and user testing with Figma.'
    },
    {
      id: '4',
      courseName: 'Docker & Kubernetes for DevOps',
      instructorName: 'Karim Hassan',
      category: 'DevOps',
      duration: 40,
      price: 3200,
      status: CourseStatus.Active,
      createdDate: '2026-04-20',
      description: 'Containerize your applications with Docker and orchestrate them at scale with Kubernetes clusters. Covers CI/CD integrations.'
    },
    {
      id: '5',
      courseName: 'React Native Mobile App Development',
      instructorName: 'Amr Khaled',
      category: 'Mobile',
      duration: 30,
      price: 1800,
      status: CourseStatus.Archived,
      createdDate: '2025-11-05',
      description: 'Build high-performance cross-platform iOS and Android applications using React Native and Expo.'
    },
    {
      id: '6',
      courseName: 'Introduction to Python Data Science',
      instructorName: 'Nour Eldin',
      category: 'Data Science',
      duration: 25,
      price: 1250,
      status: CourseStatus.Draft,
      createdDate: '2026-06-20',
      description: 'Start your journey in data science. Learn NumPy, Pandas, Matplotlib, and basic predictive models with Scikit-Learn.'
    },
    {
      id: '7',
      courseName: 'TypeScript Deep Dive',
      instructorName: 'Tarek Kamal',
      category: 'Frontend',
      duration: 12,
      price: 750,
      status: CourseStatus.Active,
      createdDate: '2026-06-05',
      description: 'Unlock the full power of TypeScript. Master generics, advanced types, utility types, and strict compilation checks.'
    },
    {
      id: '8',
      courseName: 'Go Programming Language (Golang)',
      instructorName: 'Sherif Amr',
      category: 'Backend',
      duration: 18,
      price: 1100,
      status: CourseStatus.Active,
      createdDate: '2026-05-30',
      description: 'Fast-paced introduction to Go. Learn concurrency with goroutines, interfaces, packages, and building RESTful APIs.'
    },
    {
      id: '9',
      courseName: 'TailwindCSS Premium Workflows',
      instructorName: 'Hassan Ezzat',
      category: 'Design',
      duration: 8,
      price: 450,
      status: CourseStatus.Active,
      createdDate: '2026-06-12',
      description: 'Learn utility-first CSS techniques to build highly responsive, customized layouts without writing complex vanilla CSS stylesheet rules.'
    },
    {
      id: '10',
      courseName: 'GitHub Actions CI/CD Pipelines',
      instructorName: 'Dina Mansour',
      category: 'DevOps',
      duration: 10,
      price: 600,
      status: CourseStatus.Archived,
      createdDate: '2025-09-15',
      description: 'Automate your building, testing, and deployment workflows using GitHub Actions. Build custom actions and secrets orchestration.'
    }
  ];

  constructor() {
    // Automatically force Local Storage mode if hosted on a live domain (non-localhost)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      this.isLocalStorageMode = true;
    }
    this.initLocalStorage();
  }

  /**
   * Seed Local Storage with initial data if empty
   */
  private initLocalStorage(): void {
    if (typeof window !== 'undefined' && !localStorage.getItem('courses')) {
      localStorage.setItem('courses', JSON.stringify(this.SEED_COURSES));
    }
  }

  /**
   * Get courses from Local Storage and apply filters client-side
   */
  private getFromLocalStorage(filters?: { name?: string; status?: string }): Course[] {
    this.initLocalStorage();
    let list: Course[] = [];
    try {
      list = JSON.parse(localStorage.getItem('courses') || '[]');
    } catch {
      list = this.SEED_COURSES;
    }

    if (filters?.name) {
      const searchName = filters.name.toLowerCase();
      list = list.filter(c => c.courseName.toLowerCase().includes(searchName));
    }
    if (filters?.status) {
      list = list.filter(c => c.status === filters.status);
    }
    return list;
  }

  /**
   * Fetch single course from Local Storage
   */
  private getByIdFromLocalStorage(id: string): Course {
    const list = this.getFromLocalStorage();
    const course = list.find(c => c.id === id);
    if (!course) {
      throw new Error(`Course with id ${id} not found`);
    }
    return course;
  }

  /**
   * Save course to Local Storage
   */
  private addToLocalStorage(course: Omit<Course, 'id' | 'createdDate'>): Course {
    const list = this.getFromLocalStorage();
    const newId = list.length > 0 
      ? (Math.max(...list.map(c => isNaN(Number(c.id)) ? 0 : Number(c.id))) + 1).toString()
      : '1';
    
    const newCourse: Course = {
      ...course,
      id: newId,
      createdDate: new Date().toISOString().split('T')[0]
    };

    list.push(newCourse);
    localStorage.setItem('courses', JSON.stringify(list));
    return newCourse;
  }

  /**
   * Update course in Local Storage
   */
  private updateInLocalStorage(id: string, course: Omit<Course, 'id' | 'createdDate'> & { id?: string; createdDate?: string }): Course {
    const list = this.getFromLocalStorage();
    const index = list.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Course with id ${id} not found`);
    }

    const updatedCourse: Course = {
      ...list[index],
      ...course,
      id: id,
      createdDate: list[index].createdDate // Retain original created date
    };

    list[index] = updatedCourse;
    localStorage.setItem('courses', JSON.stringify(list));
    return updatedCourse;
  }

  /**
   * Delete course from Local Storage
   */
  private deleteFromLocalStorage(id: string): void {
    let list = this.getFromLocalStorage();
    list = list.filter(c => c.id !== id);
    localStorage.setItem('courses', JSON.stringify(list));
  }

  /**
   * Get all courses with optional search query and status filtering
   */
  getCourses(filters?: { name?: string; status?: string }): Observable<Course[]> {
    if (this.isLocalStorageMode) {
      return of(this.getFromLocalStorage(filters));
    }

    let params = new HttpParams();
    if (filters?.name) {
      params = params.set('courseName_like', filters.name);
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<Course[]>(this.apiUrl, { params }).pipe(
      catchError(err => {
        // Switch to local storage if API is unreachable (connection refused / server down)
        if (err.status === 0) {
          console.warn('JSON Mock Server is down. Falling back to Local Storage mode.');
          this.isLocalStorageMode = true;
          return of(this.getFromLocalStorage(filters));
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * Fetch a single course by ID
   */
  getCourseById(id: string): Observable<Course> {
    if (this.isLocalStorageMode) {
      try {
        return of(this.getByIdFromLocalStorage(id));
      } catch (err) {
        return throwError(() => err);
      }
    }

    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        if (err.status === 0) {
          this.isLocalStorageMode = true;
          return of(this.getByIdFromLocalStorage(id));
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * Create a new course
   */
  addCourse(course: Omit<Course, 'id' | 'createdDate'>): Observable<Course> {
    if (this.isLocalStorageMode) {
      return of(this.addToLocalStorage(course));
    }

    const newCourse = {
      ...course,
      createdDate: new Date().toISOString().split('T')[0]
    };

    return this.http.post<Course>(this.apiUrl, newCourse).pipe(
      catchError(err => {
        if (err.status === 0) {
          this.isLocalStorageMode = true;
          return of(this.addToLocalStorage(course));
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * Update an existing course
   */
  updateCourse(id: string, course: Omit<Course, 'id' | 'createdDate'> & { id?: string; createdDate?: string }): Observable<Course> {
    if (this.isLocalStorageMode) {
      return of(this.updateInLocalStorage(id, course));
    }

    return this.http.put<Course>(`${this.apiUrl}/${id}`, course).pipe(
      catchError(err => {
        if (err.status === 0) {
          this.isLocalStorageMode = true;
          return of(this.updateInLocalStorage(id, course));
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * Delete a course by ID
   */
  deleteCourse(id: string): Observable<void> {
    if (this.isLocalStorageMode) {
      this.deleteFromLocalStorage(id);
      return of(undefined as any);
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        if (err.status === 0) {
          this.isLocalStorageMode = true;
          this.deleteFromLocalStorage(id);
          return of(undefined as any);
        }
        return throwError(() => err);
      })
    );
  }
}

import { CourseStatus } from './course-status.enum';

export interface Course {
  id: string;
  courseName: string;
  instructorName: string;
  category: string;
  duration: number;
  price: number;
  status: CourseStatus;
  createdDate: string;
  description?: string;
}

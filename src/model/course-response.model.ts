export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  mentors?: MentorInfo[];
  students?: StudentInfo[];
  student_count?: number;
  created_at: Date;
  updated_at: Date;
}

export interface MentorInfo {
  id: number;
  name: string;
  email: string;
}

export interface StudentInfo {
  id: number;
  name: string;
  email: string;
  progress?: number;
  completed?: boolean;
  enrolled_at?: Date;
}

export interface CourseAssignmentResponse {
  id: number;
  course: {
    id: number;
    title: string;
  };
  mentor: MentorInfo;
  created_at: Date;
}

export interface CourseEnrollmentResponse {
  id: number;
  course: {
    id: number;
    title: string;
  };
  student: StudentInfo;
  progress: number;
  completed: boolean;
  created_at: Date;
}

export interface CourseListResponse {
  data: CourseResponse[];
  paging: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface StudentListResponse {
  data: StudentInfo[];
  paging: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

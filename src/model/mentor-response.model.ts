export interface MentorDashboardResponse {
  assigned_courses: number;
  total_students: number;
  active_consultations: number;
  forum_answers_given: number;
}

export interface MentorProfileResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  bio?: string;
  experience?: string;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateMentorProfileResponse {
  message: string;
  user: {
    id: number;
    bio?: string;
    experience?: string;
    updated_at: Date;
  };
}

export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  students_enrolled: number;
  assigned_at: Date;
}

export interface AssignedCoursesResponse {
  courses: CourseResponse[];
}

export interface CourseDetailsResponse {
  id: number;
  title: string;
  description: string;
  students_enrolled: number;
  materials_count: number;
  assigned_at: Date;
}

export interface StudentResponse {
  id: number;
  name: string;
  email: string;
  enrolled_at: Date;
}

export interface CourseStudentsResponse {
  students: StudentResponse[];
}

export interface MaterialResponse {
  id: number;
  title: string;
  created_at: Date;
  updated_at: Date;
}

export interface CourseMaterialsResponse {
  materials: MaterialResponse[];
}

export interface CreateMaterialResponse {
  message: string;
  material: {
    id: number;
    course_id: number;
    title: string;
    created_at: Date;
    updated_at: Date;
  };
}

export interface UpdateMaterialResponse {
  message: string;
  material: {
    id: number;
    course_id: number;
    title: string;
    updated_at: Date;
  };
}

export interface DeleteMaterialResponse {
  message: string;
}

export interface CourseProgressResponse {
  course_id: number;
  course_title: string;
  total_materials: number;
  completed_materials: number;
  progress_percentage: number;
}

export interface StudentProgressResponse {
  student: {
    id: number;
    name: string;
    email: string;
  };
  courses_progress: CourseProgressResponse[];
}

export interface UpdateStatusResponse {
  message: string;
}

export interface TestErrorResponse {
  body: {
    errors: {
      message: string | string[];
      statusCode: number;
    };
  };
}

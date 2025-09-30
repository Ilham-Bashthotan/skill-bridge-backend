export interface AdminDashboardResponse {
  users_count: number;
  students_count: number;
  mentors_count: number;
  admins_count: number;
  courses_count: number;
  jobs_count: number;
  forum_questions: number;
}

export interface AdminProfileResponse {
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

export interface UpdateAdminProfileResponse {
  message: string;
  user: {
    id: number;
    name?: string;
    phone?: string;
    bio?: string;
    experience?: string;
    updated_at: Date;
  };
}

export interface UserListResponse {
  users: UserResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserResponse {
  message: string;
  user: {
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
  };
}

export interface DeleteUserResponse {
  message: string;
}

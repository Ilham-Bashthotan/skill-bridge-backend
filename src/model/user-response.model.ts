export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  bio?: string;
  experience?: string;
  token?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterResponse {
  message: string;
  user: UserResponse;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface UpdateProfileResponse {
  message: string;
  user: UserResponse;
}

export interface ErrorResponse {
  error: string;
  message: string | string[];
  statusCode: number;
}

// Interface for wrapped error response from ErrorFilter
export interface WrappedErrorResponse {
  errors: ErrorResponse;
}

// Type-safe test response interfaces
export interface TestSuccessResponse<T = any> {
  body: T;
  status: number;
}

export interface TestErrorResponse {
  body: WrappedErrorResponse;
  status: number;
}

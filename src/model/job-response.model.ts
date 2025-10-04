export interface JobResponse {
  id: number;
  title: string;
  description: string;
  company: string;
  requirements: string;
  location: string;
  admin?: {
    id: number;
    name: string;
    email?: string;
  };
  created_at: Date;
  updated_at?: Date;
}

export interface CreateJobResponse {
  message: string;
  job: {
    id: number;
    admin_id: number;
    title: string;
    description: string;
    company: string;
    requirements: string;
    location: string;
    created_at: Date;
  };
}

export interface UpdateJobResponse {
  message: string;
  job: {
    id: number;
    title: string;
    description: string;
    company: string;
    requirements: string;
    location: string;
    updated_at: Date;
  };
}

export interface DeleteJobResponse {
  message: string;
}

export interface GetJobsResponse {
  jobs: JobResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface SearchJobsResponse {
  jobs: (JobResponse & { relevance_score: number })[];
  search_metadata: {
    query: string;
    total_results: number;
    search_time_ms: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface JobStatisticsResponse {
  total_jobs: number;
  active_jobs: number;
  jobs_this_month: number;
  jobs_this_year: number;
  top_companies: {
    company: string;
    job_count: number;
  }[];
  top_locations: {
    location: string;
    job_count: number;
  }[];
  monthly_breakdown: {
    month: string;
    count: number;
  }[];
}

export interface CompaniesResponse {
  companies: {
    name: string;
    job_count: number;
    latest_job: {
      id: number;
      title: string;
      created_at: Date;
    } | null;
  }[];
}

export interface LocationsResponse {
  locations: {
    location: string;
    job_count: number;
  }[];
}

export interface TestJobErrorResponse {
  error?: string;
  errors?: {
    error: string;
    message: string | string[];
    statusCode: number;
  };
}

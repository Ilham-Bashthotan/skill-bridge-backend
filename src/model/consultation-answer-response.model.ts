export interface ConsultationAnswerResponseModel {
  id: number;
  consultations_question_id: number;
  mentor_id: number;
  message: string;
  mentor?: {
    id: number;
    name: string;
    email?: string;
    role: string;
    bio?: string | null;
    experience?: string | null;
  };
  consultation_question?: {
    id: number;
    title: string;
    message: string;
    student?: {
      id: number;
      name: string;
      email?: string;
    };
  };
  created_at: Date;
  updated_at: Date;
}

export interface ConsultationAnswerSearchResponseModel {
  id: number;
  consultations_question_id: number;
  message: string;
  mentor: {
    name: string;
    role: string;
  };
  relevance_score: number;
  created_at: Date;
}

export interface CreateConsultationAnswerResponse {
  message: string;
  answer: {
    id: number;
    consultations_question_id: number;
    mentor_id: number;
    message: string;
    created_at: Date;
    updated_at: Date;
  };
}

export interface UpdateConsultationAnswerResponse {
  message: string;
  answer: {
    id: number;
    consultations_question_id: number;
    mentor_id: number;
    message: string;
    created_at: Date;
    updated_at: Date;
  };
}

export interface ConsultationAnswerListResponse {
  answers: ConsultationAnswerResponseModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ConsultationAnswerSearchResponse {
  answers: ConsultationAnswerSearchResponseModel[];
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

export interface ConsultationAnswerStatisticsResponse {
  total_answers: number;
  answers_this_month: number;
  answers_this_year: number;
}

export interface ConsultationAnswerDeleteResponse {
  message: string;
}

// Test error response interface
export interface TestConsultationAnswerErrorResponse {
  body: {
    errors: {
      message: string | string[];
      statusCode: number;
    };
  };
}

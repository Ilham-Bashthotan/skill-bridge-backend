export interface ForumQuestionResponse {
  id: number;
  student_id: number;
  title: string;
  message: string;
  student: {
    id: number;
    name: string;
    email?: string;
  };
  answers?: ForumAnswerResponse[];
  answers_count: number;
  latest_answer?: {
    id: number;
    created_at: Date;
    user: {
      name: string;
    };
  };
  created_at: Date;
  updated_at: Date;
}

export interface ForumAnswerResponse {
  id: number;
  user_id: number;
  message: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
  created_at: Date;
}

export interface GetForumQuestionsResponse {
  questions: ForumQuestionResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface CreateForumQuestionResponse {
  message: string;
  question: {
    id: number;
    student_id: number;
    title: string;
    message: string;
    created_at: Date;
    updated_at: Date;
  };
}

export interface UpdateForumQuestionResponse {
  message: string;
  question: {
    id: number;
    student_id: number;
    title: string;
    message: string;
    created_at: Date;
    updated_at: Date;
  };
}

export interface DeleteForumQuestionResponse {
  message: string;
}

export interface SearchForumQuestionsResponse {
  questions: (ForumQuestionResponse & {
    relevance_score: number;
  })[];
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

export interface ForumQuestionStatisticsResponse {
  total_questions: number;
  answered_questions: number;
  unanswered_questions: number;
  questions_this_month: number;
  questions_this_year: number;
  average_answers_per_question: number;
  most_active_students: {
    student_id: number;
    student_name: string;
    questions_count: number;
  }[];
  popular_topics: {
    topic: string;
    question_count: number;
  }[];
  monthly_breakdown: {
    month: string;
    questions: number;
    answers: number;
  }[];
}

export interface ForumQuestionErrorResponse {
  error: string;
  message?: string | string[];
  statusCode?: number;
}

export interface ValidatedGetAnswersQuery {
  consultations_question_id?: number;
  mentor_id?: number;
  page: number;
  limit: number;
  sort: string;
  order: string;
}

export interface ValidatedCreateAnswer {
  consultations_question_id: number;
  message: string;
}

export interface ValidatedUpdateAnswer {
  message?: string;
}

export interface ValidatedSearchQuery {
  q: string;
  consultations_question_id?: number;
  mentor_id?: number;
  page: number;
  limit: number;
}

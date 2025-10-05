export class ForumAnswerResponseModel {
  id: number;
  question_id: number;
  user_id: number;
  message: string;
  user?: {
    id: number;
    name: string;
    role: string;
    email?: string;
    expertise?: string;
  };
  question?: {
    id: number;
    title: string;
    message?: string;
    student?: {
      name: string;
    };
  };
  created_at: Date;
  updated_at: Date;
  relevance_score?: number;
}

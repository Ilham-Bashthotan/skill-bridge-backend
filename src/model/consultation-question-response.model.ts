export class ConsultationQuestionResponseModel {
  id: number;
  student_id: number;
  title: string;
  message: string;
  student?: {
    id: number;
    name: string;
    email: string;
  };
  answers?: {
    id: number;
    mentor_id: number;
    message: string;
    user: {
      id: number;
      name: string;
      role: string;
    };
    created_at: Date;
  }[];
  answers_count: number;
  latest_answer?: {
    created_at: Date;
    user: {
      name: string;
    };
  };
  created_at: Date;
  updated_at: Date;
}

export interface DailyScrumDTO {
  date: string;
  answersByUser: UserAnswerDTO[];
}

export interface UserAnswerDTO {
  userId: string;
  userName: string;
  questions: string[];
  answers: string[];
}

export interface DailyScrumUpdateDTO {
  scrumId: string;
  answers: string[];
  questions: string[];
}

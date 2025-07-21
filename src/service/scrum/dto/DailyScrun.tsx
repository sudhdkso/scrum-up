export interface DailyScrumDTO {
  date: string;
  answersByUser: UserAnswerDTO[];
}

export interface UserAnswerDTO {
  userId: string;
  userName: string;
  answers: string[];
}

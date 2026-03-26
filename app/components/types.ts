export type Question = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
};

export type Answer = {
  questionId: number;
  selectedIndex: number;
  correct: boolean;
};

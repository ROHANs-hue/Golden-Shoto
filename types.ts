
export enum BeltColor {
  WHITE = 'White',
  YELLOW = 'Yellow',
  YELLOW_2 = 'Yellow 2',
  BLUE = 'Blue',
  GREEN = 'Green',
  PURPLE = 'Purple',
  BROWN = 'Brown',
  BROWN_1 = 'Brown 1',
  BROWN_2 = 'Brown 2',
  BLACK = 'Black'
}

export interface User {
  name: string;
  belt: BeltColor;
  points?: number;
  password?: string;
}

export interface Question {
  question: string;
  questionBengali: string;
  options: string[];
  optionsBengali: string[];
  correctAnswer: number;
  explanation: string;
  explanationBengali: string;
}

export interface QuizResult {
  id: string;
  studentName: string;
  belt: BeltColor;
  score: number;
  total: number;
  timestamp: number;
  details: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

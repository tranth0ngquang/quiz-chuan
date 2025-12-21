// Types for Question Bank
export interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

// Types for Quiz Session
export interface QuizAnswer {
  questionId: number;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
}

export interface QuizSession {
  bankId: string;
  bankName: string;
  questions: Question[];
  answers: QuizAnswer[];
  startTime: number;
  endTime?: number;
}

// Types for Wrong Questions
export interface WrongQuestion {
  bankId: string;
  bankName: string;
  question: Question;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  timestamp: number;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongQuestions: WrongQuestion[];
  percentage: number;
}

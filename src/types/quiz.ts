// Types for Question Bank

// Standard single question
export interface SingleQuestion {
  id: number;
  type?: 'single'; // default type
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

// Sub-question within a passage
export interface PassageSubQuestion {
  id: number;
  question: string; // Can be blank indicator like "____9____" for fill-in-blank, or actual question for reading comprehension
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

// Passage-based question group (reading comprehension or fill-in-the-blank)
export interface PassageQuestion {
  id: number;
  type: 'passage';
  passageType: 'reading-comprehension' | 'fill-in-the-blank';
  passageTitle?: string; // Optional title for the passage
  passage: string; // The passage text (with blanks like ____9____ for fill-in-blank type)
  subQuestions: PassageSubQuestion[];
}

// Union type for all question types
export type Question = SingleQuestion | PassageQuestion;

// Helper type guards
export function isPassageQuestion(question: Question): question is PassageQuestion {
  return question.type === 'passage';
}

export function isSingleQuestion(question: Question): question is SingleQuestion {
  return !question.type || question.type === 'single';
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

import { WrongQuestion, Question } from '@/types/quiz';

const STORAGE_KEY = 'quiz-wrong-questions';
const QUIZ_SESSION_KEY = 'quiz-in-progress';

// Interface for saved quiz session
export interface SavedQuizSession {
  bankId: string;
  bankName: string;
  questions: Question[];
  answers: Array<{
    questionId: number;
    selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
    subAnswers?: Record<number, 'A' | 'B' | 'C' | 'D' | null>;
  }>;
  currentIndex: number;
  startTime: number;
  lastUpdated: number;
}

// Quiz Session Storage - for saving progress
export const quizSessionStorage = {
  // Save current quiz session
  save(session: SavedQuizSession): void {
    if (typeof window === 'undefined') return;
    const allSessions = this.getAllSessions();
    allSessions[session.bankId] = {
      ...session,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(allSessions));
  },

  // Get all saved sessions
  getAllSessions(): Record<string, SavedQuizSession> {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(QUIZ_SESSION_KEY);
    return data ? JSON.parse(data) : {};
  },

  // Get session for a specific bank
  getSession(bankId: string): SavedQuizSession | null {
    const sessions = this.getAllSessions();
    return sessions[bankId] || null;
  },

  // Check if there's an in-progress session for a bank
  hasSession(bankId: string): boolean {
    return this.getSession(bankId) !== null;
  },

  // Remove a session (when quiz is completed or abandoned)
  removeSession(bankId: string): void {
    if (typeof window === 'undefined') return;
    const sessions = this.getAllSessions();
    delete sessions[bankId];
    localStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(sessions));
  },

  // Clear all sessions
  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(QUIZ_SESSION_KEY);
  },

  // Get count of in-progress sessions
  getCount(): number {
    return Object.keys(this.getAllSessions()).length;
  },
};

export const wrongQuestionsStorage = {
  // Get all wrong questions
  getAll(): WrongQuestion[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Add wrong questions from a quiz session
  addWrongQuestions(questions: WrongQuestion[]): void {
    if (typeof window === 'undefined') return;
    const existing = this.getAll();
    
    // Add new wrong questions, avoiding duplicates based on questionId and bankId
    const combined = [...existing];
    questions.forEach((newQ) => {
      const isDuplicate = existing.some(
        (existingQ) =>
          existingQ.question.id === newQ.question.id &&
          existingQ.bankId === newQ.bankId
      );
      if (!isDuplicate) {
        combined.push(newQ);
      }
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
  },

  // Remove a wrong question (when answered correctly)
  removeWrongQuestion(bankId: string, questionId: number): void {
    if (typeof window === 'undefined') return;
    const existing = this.getAll();
    const filtered = existing.filter(
      (q) => !(q.bankId === bankId && q.question.id === questionId)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Clear all wrong questions
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },

  // Get count of wrong questions
  getCount(): number {
    return this.getAll().length;
  },

  // Get wrong questions by bank
  getByBank(bankId: string): WrongQuestion[] {
    return this.getAll().filter((q) => q.bankId === bankId);
  },
};

import { WrongQuestion } from '@/types/quiz';

const STORAGE_KEY = 'quiz-wrong-questions';

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

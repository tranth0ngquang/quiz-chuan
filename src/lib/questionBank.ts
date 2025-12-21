import { QuestionBank } from '@/types/quiz';

// Import all question banks
import networkBank from '@/../data/network.json';
import dsaBank from '@/../data/dsa.json';
import calculusBank from '@/../data/calculus.json';

export const questionBanks: QuestionBank[] = [
  networkBank as QuestionBank,
  dsaBank as QuestionBank,
  calculusBank as QuestionBank,
];

export function getQuestionBank(bankId: string): QuestionBank | undefined {
  return questionBanks.find((bank) => bank.id === bankId);
}

export function getRandomQuestions(
  bankId: string,
  count: number
): QuestionBank['questions'] {
  const bank = getQuestionBank(bankId);
  if (!bank) return [];

  const shuffled = [...bank.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

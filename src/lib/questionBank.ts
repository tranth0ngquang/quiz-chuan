import { QuestionBank, Question } from '@/types/quiz';

// Import modular English bank
import englishIndex from '@/../data/english/index.json';
import englishPart1 from '@/../data/english/part1-prepositions-time.json';
import englishPart2 from '@/../data/english/part2-prepositions-place.json';
import englishPart3 from '@/../data/english/part3-prepositions-other.json';
import englishPart4 from '@/../data/english/part4-conjunctions.json';
import englishPart5 from '@/../data/english/part5-passages.json';
import englishPart6 from '@/../data/english/part6-relative-pronouns.json';
import englishPart7 from '@/../data/english/part7-relative-pronouns-extended.json';
import englishPart8 from '@/../data/english/part8-subjunctive-mood.json';
import englishPart9 from '@/../data/english/part9-subjunctive-mood-extended.json';
import englishPart10 from '@/../data/english/part10-subjunctive-mood-passages.json';
import englishPart11 from '@/../data/english/part11-subject-verb-agreement.json';
import englishPart12 from '@/../data/english/part12-subject-verb-agreement-extended.json';
import englishPart13 from '@/../data/english/part13-subject-verb-agreement-passages.json';
import englishPart14 from '@/../data/english/part14-bonus-exercises.json';
import englishPart15 from '@/../data/english/part15-mixed-grammar-exercises.json';
import englishPart16 from '@/../data/english/part16-prepositions-verbs.json';
import englishPart17 from '@/../data/english/part17-relative-adverbs.json';
import englishPart18 from '@/../data/english/part18-prepositions-practice.json';

// Import modular Network bank
import networkIndex from '@/../data/network/index.json';
import networkPart1 from '@/../data/network/part1-overview-and-edge.json';
import networkPart2 from '@/../data/network/part2-application-layer.json';
import networkPart3 from '@/../data/network/part3-transport-layer.json';
import networkPart4 from '@/../data/network/part4-network-layer.json';
import networkPart5 from '@/../data/network/part5-link-layer.json';
import networkPart6 from '@/../data/network/part6-ipv4-addressing.json';



/**
 * Interface for modular question parts
 */
interface QuestionPart {
  partId: string;
  partName: string;
  questions: Question[];
}

/**
 * Merge multiple parts into a single QuestionBank
 */
function mergeQuestionParts(
  id: string,
  name: string,
  description: string,
  parts: QuestionPart[]
): QuestionBank {
  const allQuestions: Question[] = [];
  
  for (const part of parts) {
    allQuestions.push(...(part.questions as Question[]));
  }
  
  // Count total questions including sub-questions
  let totalQuestions = 0;
  allQuestions.forEach(q => {
    if (q.type === 'passage' && 'subQuestions' in q) {
      totalQuestions += q.subQuestions.length;
    } else {
      totalQuestions += 1;
    }
  });
  
  return {
    id,
    name,
    description: `${description} (${allQuestions.length} mục, ${totalQuestions} câu hỏi)`,
    questions: allQuestions
  };
}

// Build the English bank from parts
const englishBank = mergeQuestionParts(
  englishIndex.id,
  englishIndex.name,
  englishIndex.description,
  [
    englishPart1 as QuestionPart,
    englishPart2 as QuestionPart,
    englishPart3 as QuestionPart,
    englishPart4 as QuestionPart,
    englishPart5 as QuestionPart,
    englishPart6 as QuestionPart,
    englishPart7 as QuestionPart,
    englishPart8 as QuestionPart,
    englishPart9 as QuestionPart,
    englishPart10 as QuestionPart,
    englishPart11 as QuestionPart,
    englishPart12 as QuestionPart,
    englishPart13 as QuestionPart,
    englishPart14 as QuestionPart,
    englishPart15 as QuestionPart,
    englishPart16 as QuestionPart,
    englishPart17 as QuestionPart,
    englishPart18 as QuestionPart,
  ]
);

// Build the Network bank from parts
const networkBank = mergeQuestionParts(
  networkIndex.id,
  networkIndex.name,
  networkIndex.description,
  [
    networkPart1 as QuestionPart,
    networkPart2 as QuestionPart,
    networkPart3 as QuestionPart,
    networkPart4 as QuestionPart,
    networkPart5 as QuestionPart,
    networkPart6 as QuestionPart,
  ]
);

export const questionBanks: QuestionBank[] = [
  networkBank,
  englishBank,
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

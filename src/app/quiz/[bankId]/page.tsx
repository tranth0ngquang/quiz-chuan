'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getQuestionBank, getRandomQuestions } from '@/lib/questionBank';
import { Question, QuizAnswer, WrongQuestion } from '@/types/quiz';
import { wrongQuestionsStorage } from '@/lib/storage';

export default function QuizPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const bankId = params.bankId as string;
  const count = parseInt(searchParams.get('count') || '10');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [bankName, setBankName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bankId === 'wrong') {
      // Load wrong questions
      const wrongQuestions = wrongQuestionsStorage.getAll();
      if (wrongQuestions.length === 0) {
        router.push('/');
        return;
      }
      setQuestions(wrongQuestions.map((wq) => wq.question));
      setBankName('Các câu sai cần ôn tập');
      setAnswers(
        wrongQuestions.map((wq) => ({
          questionId: wq.question.id,
          selectedAnswer: null,
        }))
      );
    } else {
      const bank = getQuestionBank(bankId);
      if (!bank) {
        router.push('/');
        return;
      }
      const selectedQuestions = getRandomQuestions(bankId, count);
      setQuestions(selectedQuestions);
      setBankName(bank.name);
      setAnswers(
        selectedQuestions.map((q) => ({
          questionId: q.id,
          selectedAnswer: null,
        }))
      );
    }
    setIsLoading(false);
  }, [bankId, count, router]);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      questionId: currentQuestion.id,
      selectedAnswer: answer,
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate results
    let correctCount = 0;
    const wrongQuestions: WrongQuestion[] = [];

    questions.forEach((question, idx) => {
      const userAnswer = answers[idx]?.selectedAnswer;
      if (userAnswer === question.correctAnswer) {
        correctCount++;
        // Remove from wrong questions if answered correctly
        if (bankId === 'wrong') {
          const wrongQ = wrongQuestionsStorage.getAll().find(
            (wq) => wq.question.id === question.id
          );
          if (wrongQ) {
            wrongQuestionsStorage.removeWrongQuestion(wrongQ.bankId, question.id);
          }
        }
      } else if (userAnswer) {
        wrongQuestions.push({
          bankId: bankId === 'wrong' ? 'mixed' : bankId,
          bankName,
          question,
          selectedAnswer: userAnswer,
          timestamp: Date.now(),
        });
      }
    });

    // Save wrong questions (only if not in wrong questions mode)
    if (bankId !== 'wrong') {
      wrongQuestionsStorage.addWrongQuestions(wrongQuestions);
    }

    // Navigate to results page with state
    const resultData = {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongQuestions,
      percentage: Math.round((correctCount / questions.length) * 100),
      bankName,
      questions,
      answers,
    };

    sessionStorage.setItem('quizResult', JSON.stringify(resultData));
    router.push('/result');
  };

  if (isLoading || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Đang tải...</p>
      </div>
    );
  }

  const answeredCount = answers.filter((a) => a.selectedAnswer !== null).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {bankName}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span>
              Câu {currentIndex + 1}/{questions.length}
            </span>
            <span>•</span>
            <span>
              Đã trả lời: {answeredCount}/{questions.length}
            </span>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-lg md:text-xl font-semibold mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {(Object.keys(currentQuestion.options) as Array<'A' | 'B' | 'C' | 'D'>).map(
                (key) => (
                  <button
                    key={key}
                    onClick={() => handleAnswerSelect(key)}
                    className={`w-full p-4 md:p-6 text-left rounded-lg border-2 transition-all ${
                      currentAnswer?.selectedAnswer === key
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 font-semibold text-sm">
                        {key}
                      </span>
                      <span className="flex-1 text-base">
                        {currentQuestion.options[key]}
                      </span>
                    </div>
                  </button>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            size="lg"
          >
            ← Câu trước
          </Button>

          <div className="flex gap-2">
            {currentIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                Nộp bài ({answeredCount}/{questions.length})
              </Button>
            ) : (
              <Button onClick={handleNext} size="lg">
                Câu tiếp →
              </Button>
            )}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-medium mb-3">Chuyển nhanh đến câu:</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                  idx === currentIndex
                    ? 'bg-blue-500 text-white'
                    : answers[idx]?.selectedAnswer
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

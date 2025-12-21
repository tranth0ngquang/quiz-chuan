'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question, WrongQuestion } from '@/types/quiz';

interface ResultData {
  totalQuestions: number;
  correctAnswers: number;
  wrongQuestions: WrongQuestion[];
  percentage: number;
  bankName: string;
  questions: Question[];
  answers: Array<{
    questionId: number;
    selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  }>;
}

export default function ResultPage() {
  const [result, setResult] = useState<ResultData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem('quizResult');
    if (!data) {
      router.push('/');
      return;
    }
    setResult(JSON.parse(data));
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Đang tải...</p>
      </div>
    );
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage === 100) return '🎉 Xuất sắc! Bạn đã trả lời đúng tất cả!';
    if (percentage >= 80) return '👏 Tuyệt vời! Kết quả rất tốt!';
    if (percentage >= 60) return '👍 Khá tốt! Hãy cố gắng thêm!';
    return '💪 Hãy ôn tập thêm và cố gắng hơn!';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Score Summary */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Kết quả bài làm</CardTitle>
            <p className="text-lg text-muted-foreground">{result.bankName}</p>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.percentage)}`}>
                {result.percentage}%
              </div>
              <p className="text-xl mb-4">
                {result.correctAnswers}/{result.totalQuestions} câu đúng
              </p>
              <p className="text-lg text-muted-foreground">
                {getScoreMessage(result.percentage)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" variant="outline">
                  Về trang chủ
                </Button>
              </Link>
              {result.wrongQuestions.length > 0 && (
                <Link href="/quiz/wrong">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                    Làm lại các câu sai ({result.wrongQuestions.length})
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Chi tiết từng câu hỏi</h2>

          {result.questions.map((question, idx) => {
            const userAnswer = result.answers[idx]?.selectedAnswer;
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <Card
                key={question.id}
                className={`${
                  isCorrect
                    ? 'border-green-300 bg-green-50/50 dark:bg-green-900/10'
                    : userAnswer
                    ? 'border-red-300 bg-red-50/50 dark:bg-red-900/10'
                    : 'border-gray-300'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <span
                      className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-semibold ${
                        isCorrect
                          ? 'bg-green-500 text-white'
                          : userAnswer
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-4">{question.question}</h3>

                      <div className="space-y-2">
                        {(Object.keys(question.options) as Array<'A' | 'B' | 'C' | 'D'>).map(
                          (key) => {
                            const isUserAnswer = userAnswer === key;
                            const isCorrectAnswer = question.correctAnswer === key;

                            return (
                              <div
                                key={key}
                                className={`p-3 rounded-lg border-2 ${
                                  isCorrectAnswer
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                    : isUserAnswer
                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="font-semibold">{key}.</span>
                                  <span className="flex-1">{question.options[key]}</span>
                                  {isCorrectAnswer && (
                                    <span className="text-green-600 font-semibold">✓ Đúng</span>
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <span className="text-red-600 font-semibold">✗ Bạn chọn</span>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>

                      {!userAnswer && (
                        <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ⚠️ Bạn chưa trả lời câu này
                          </p>
                        </div>
                      )}

                      {question.explanation && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                            📖 Giải thích:
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/">
            <Button size="lg" variant="outline">
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

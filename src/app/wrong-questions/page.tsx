'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { wrongQuestionsStorage } from '@/lib/storage';
import { WrongQuestion } from '@/types/quiz';

export default function WrongQuestionsPage() {
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([]);
  const router = useRouter();

  useEffect(() => {
    const questions = wrongQuestionsStorage.getAll();
    setWrongQuestions(questions);
  }, []);

  const handleClearAll = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả các câu sai?')) {
      wrongQuestionsStorage.clear();
      setWrongQuestions([]);
    }
  };

  const handleRemoveQuestion = (bankId: string, questionId: number) => {
    wrongQuestionsStorage.removeWrongQuestion(bankId, questionId);
    setWrongQuestions(wrongQuestionsStorage.getAll());
  };

  if (wrongQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách câu sai</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-6">
                🎉 Tuyệt vời! Bạn chưa có câu nào sai.
              </p>
              <Link href="/">
                <Button>Về trang chủ</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Group by bank
  const groupedByBank = wrongQuestions.reduce((acc, wq) => {
    if (!acc[wq.bankId]) {
      acc[wq.bankId] = {
        bankName: wq.bankName,
        questions: [],
      };
    }
    acc[wq.bankId].questions.push(wq);
    return acc;
  }, {} as Record<string, { bankName: string; questions: WrongQuestion[] }>);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Danh sách câu sai</CardTitle>
            <p className="text-muted-foreground">
              Bạn có {wrongQuestions.length} câu cần ôn tập
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link href="/quiz/wrong">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  Làm lại tất cả ({wrongQuestions.length} câu)
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={handleClearAll}>
                Xóa tất cả
              </Button>
              <Link href="/">
                <Button variant="outline" size="lg">
                  Về trang chủ
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Questions grouped by bank */}
        <div className="space-y-6">
          {Object.entries(groupedByBank).map(([bankId, { bankName, questions }]) => (
            <div key={bankId}>
              <h2 className="text-xl font-bold mb-4">
                {bankName} ({questions.length} câu)
              </h2>
              <div className="space-y-4">
                {questions.map((wq, idx) => (
                  <Card key={`${wq.bankId}-${wq.question.id}`} className="border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-semibold text-sm">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-4">
                            {wq.question.question}
                          </h3>

                          <div className="space-y-2 mb-4">
                            {(
                              Object.keys(wq.question.options) as Array<'A' | 'B' | 'C' | 'D'>
                            ).map((key) => {
                              const isUserAnswer = wq.selectedAnswer === key;
                              const isCorrectAnswer = wq.question.correctAnswer === key;

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
                                    <span className="flex-1">{wq.question.options[key]}</span>
                                    {isCorrectAnswer && (
                                      <span className="text-green-600 font-semibold">
                                        ✓ Đáp án đúng
                                      </span>
                                    )}
                                    {isUserAnswer && !isCorrectAnswer && (
                                      <span className="text-red-600 font-semibold">
                                        ✗ Bạn đã chọn
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {wq.question.explanation && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                              <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                                📖 Giải thích:
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">
                                {wq.question.explanation}
                              </p>
                            </div>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestion(wq.bankId, wq.question.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Xóa khỏi danh sách
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

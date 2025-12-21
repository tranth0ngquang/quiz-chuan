'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { questionBanks } from '@/lib/questionBank';
import { wrongQuestionsStorage } from '@/lib/storage';
import { useState, useEffect } from 'react';

export default function Home() {
  const [wrongQuestionsCount, setWrongQuestionsCount] = useState(0);
  const questionCounts = [10, 20, 50];

  useEffect(() => {
    setWrongQuestionsCount(wrongQuestionsStorage.getCount());
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Ứng dụng Trắc nghiệm
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Chọn môn học và bắt đầu làm bài kiểm tra
          </p>
        </div>

        {/* Wrong Questions Section */}
        {wrongQuestionsCount > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardHeader>
              <CardTitle className="text-orange-700 dark:text-orange-300">
                Câu hỏi cần ôn tập
              </CardTitle>
              <CardDescription>
                Bạn có {wrongQuestionsCount} câu đã trả lời sai cần ôn lại
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Link href="/wrong-questions">
                  <Button variant="outline" className="border-orange-300">
                    Xem danh sách câu sai
                  </Button>
                </Link>
                <Link href="/quiz/wrong">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Làm lại các câu sai
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Banks */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questionBanks.map((bank) => (
            <Card key={bank.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{bank.name}</CardTitle>
                <CardDescription>{bank.description}</CardDescription>
                <p className="text-sm text-muted-foreground">
                  {bank.questions.length} câu hỏi
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium mb-3">Chọn số câu hỏi:</p>
                  <div className="flex gap-2 flex-wrap">
                    {questionCounts.map((count) => (
                      <Link
                        key={count}
                        href={`/quiz/${bank.id}?count=${count}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={count > bank.questions.length}
                        >
                          {count} câu
                        </Button>
                      </Link>
                    ))}
                  </div>
                  <Link href={`/quiz/${bank.id}?count=${bank.questions.length}`}>
                    <Button className="w-full mt-4" size="lg">
                      Làm tất cả ({bank.questions.length} câu)
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

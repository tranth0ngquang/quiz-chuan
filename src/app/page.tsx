'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { questionBanks } from '@/lib/questionBank';
import { wrongQuestionsStorage, quizSessionStorage, SavedQuizSession } from '@/lib/storage';
import { useState, useEffect } from 'react';

export default function Home() {
  const [wrongQuestionsCount, setWrongQuestionsCount] = useState(0);
  const [savedSessions, setSavedSessions] = useState<Record<string, SavedQuizSession>>({});
  const questionCounts = [10, 20, 50];

  useEffect(() => {
    setWrongQuestionsCount(wrongQuestionsStorage.getCount());
    setSavedSessions(quizSessionStorage.getAllSessions());
  }, []);

  const handleAbandonQuiz = (bankId: string) => {
    if (confirm('Bạn có chắc muốn bỏ bài thi đang làm dở? Tiến độ sẽ bị xóa.')) {
      quizSessionStorage.removeSession(bankId);
      setSavedSessions(quizSessionStorage.getAllSessions());
    }
  };

  const getAnsweredCount = (session: SavedQuizSession) => {
    let count = 0;
    session.answers.forEach((a) => {
      if (a.subAnswers) {
        count += Object.values(a.subAnswers).filter(v => v !== null).length;
      } else if (a.selectedAnswer !== null) {
        count++;
      }
    });
    return count;
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return 'Vừa xong';
  };

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

        {/* In-Progress Sessions */}
        {Object.keys(savedSessions).length > 0 && (
          <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="text-blue-700 dark:text-blue-300">
                📝 Bài thi đang làm dở
              </CardTitle>
              <CardDescription>
                Bạn có {Object.keys(savedSessions).length} bài thi chưa hoàn thành
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.values(savedSessions).map((session) => (
                  <div 
                    key={session.bankId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border gap-4"
                  >
                    <div>
                      <h3 className="font-semibold">{session.bankName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Đã trả lời: {getAnsweredCount(session)}/{session.questions.length} câu • 
                        Cập nhật: {formatTimeAgo(session.lastUpdated)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/quiz/${session.bankId}?continue=true`}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Tiếp tục làm
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => handleAbandonQuiz(session.bankId)}
                      >
                        Bỏ bài
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                  {/* Show continue option if there's a saved session */}
                  {savedSessions[bank.id] && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                        📝 Có bài đang làm dở ({getAnsweredCount(savedSessions[bank.id])}/{savedSessions[bank.id].questions.length} câu)
                      </p>
                      <div className="flex gap-2">
                        <Link href={`/quiz/${bank.id}?continue=true`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Tiếp tục
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAbandonQuiz(bank.id)}
                        >
                          Làm mới
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm font-medium mb-3">Chế độ học tập (xem giải thích ngay):</p>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {questionCounts.map((count) => (
                      <Link
                        key={count}
                        href={`/quiz/${bank.id}?count=${count}&mode=learning`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-700 hover:bg-green-50"
                          disabled={count > bank.questions.length}
                        >
                          📖 {count} câu
                        </Button>
                      </Link>
                    ))}
                    <Link href={`/quiz/${bank.id}?count=${bank.questions.length}&mode=learning`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        📖 Tất cả
                      </Button>
                    </Link>
                  </div>

                  <p className="text-sm font-medium mb-3">Chế độ thi (làm bài kiểm tra):</p>
                  <div className="flex gap-2 flex-wrap">
                    {questionCounts.map((count) => (
                      <Link
                        key={count}
                        href={`/quiz/${bank.id}?count=${count}&mode=test`}
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
                  <Link href={`/quiz/${bank.id}?count=${bank.questions.length}&mode=test`}>
                    <Button className="w-full mt-4" size="lg">
                      Thi tất cả ({bank.questions.length} câu)
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

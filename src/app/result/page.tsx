'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question, WrongQuestion, isPassageQuestion, isSingleQuestion, PassageQuestion, SingleQuestion } from '@/types/quiz';

interface ExtendedQuizAnswer {
  questionId: number;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  subAnswers?: Record<number, 'A' | 'B' | 'C' | 'D' | null>;
}

interface ResultData {
  totalQuestions: number;
  correctAnswers: number;
  wrongQuestions: WrongQuestion[];
  percentage: number;
  bankName: string;
  questions: Question[];
  answers: ExtendedQuizAnswer[];
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

  // Render single question review
  const renderSingleQuestionReview = (question: SingleQuestion, answer: ExtendedQuizAnswer, idx: number) => {
    const userAnswer = answer?.selectedAnswer;
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
  };

  // Render passage question review
  const renderPassageQuestionReview = (question: PassageQuestion, answer: ExtendedQuizAnswer, idx: number) => {
    const subAnswers = answer?.subAnswers || {};
    
    // Count correct sub-questions
    const correctCount = question.subQuestions.filter(
      sq => subAnswers[sq.id] === sq.correctAnswer
    ).length;
    const totalCount = question.subQuestions.length;
    const allCorrect = correctCount === totalCount;
    const hasWrong = correctCount < totalCount && Object.values(subAnswers).some(a => a !== null);

    // Render passage with answer highlights
    const renderPassageWithAnswers = () => {
      let passageText = question.passage;
      
      question.subQuestions.forEach((sq) => {
        const blankPattern = new RegExp(`____${sq.id}____`, 'g');
        const userAnswer = subAnswers[sq.id];
        const isCorrect = userAnswer === sq.correctAnswer;
        
        let displayText = `(${sq.id})`;
        if (userAnswer) {
          displayText = `[${userAnswer}${isCorrect ? ' ✓' : ' ✗'}]`;
        }

        passageText = passageText.replace(
          blankPattern,
          `<span class="inline-block px-2 py-1 mx-1 rounded font-semibold ${
            isCorrect 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
              : userAnswer
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-gray-200 dark:bg-gray-700'
          }">${displayText}</span>`
        );
      });

      return passageText;
    };

    return (
      <Card
        key={question.id}
        className={`${
          allCorrect
            ? 'border-green-300 bg-green-50/50 dark:bg-green-900/10'
            : hasWrong
            ? 'border-red-300 bg-red-50/50 dark:bg-red-900/10'
            : 'border-gray-300'
        }`}
      >
        <CardContent className="p-6">
          {/* Passage Header */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-semibold ${
                allCorrect
                  ? 'bg-green-500 text-white'
                  : hasWrong
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-400 text-white'
              }`}
            >
              {idx + 1}
            </span>
            <div>
              <h3 className="font-semibold text-lg">
                📖 {question.passageTitle || 'Đoạn văn'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {question.passageType === 'fill-in-the-blank' ? 'Điền từ' : 'Đọc hiểu'} • 
                Đúng: {correctCount}/{totalCount}
              </p>
            </div>
          </div>

          {/* Passage Text */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border mb-6">
            <div 
              className="prose dark:prose-invert max-w-none leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: renderPassageWithAnswers() }}
            />
          </div>

          {/* Sub-questions review */}
          <div className="space-y-4">
            {question.subQuestions.map((subQ) => {
              const userAnswer = subAnswers[subQ.id];
              const isCorrect = userAnswer === subQ.correctAnswer;

              return (
                <div 
                  key={subQ.id} 
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'border-green-300 bg-green-50/50 dark:bg-green-900/10'
                      : userAnswer
                      ? 'border-red-300 bg-red-50/50 dark:bg-red-900/10'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <h4 className="font-medium mb-3">
                    Câu {subQ.id}: {subQ.question}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(Object.keys(subQ.options) as Array<'A' | 'B' | 'C' | 'D'>).map((key) => {
                      const isUserAnswer = userAnswer === key;
                      const isCorrectAnswer = subQ.correctAnswer === key;

                      return (
                        <div
                          key={key}
                          className={`p-2 rounded border ${
                            isCorrectAnswer
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : isUserAnswer
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold">{key}.</span>
                            <span className="flex-1">{subQ.options[key]}</span>
                            {isCorrectAnswer && <span className="text-green-600">✓</span>}
                            {isUserAnswer && !isCorrectAnswer && <span className="text-red-600">✗</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!userAnswer && (
                    <p className="mt-2 text-sm text-gray-500">⚠️ Chưa trả lời</p>
                  )}

                  {subQ.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <p className="text-sm">
                        <span className="font-semibold text-blue-900 dark:text-blue-300">📖 </span>
                        {subQ.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
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
            // Handle passage questions differently
            if (isPassageQuestion(question)) {
              return renderPassageQuestionReview(question, result.answers[idx], idx);
            }
            return renderSingleQuestionReview(question as SingleQuestion, result.answers[idx], idx);
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

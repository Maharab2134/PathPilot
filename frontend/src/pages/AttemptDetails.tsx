import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { quizService } from '@/services/api';
import { Attempt } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Check, X } from 'lucide-react';

export const AttemptDetails: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttempt = async () => {
      if (!attemptId) return;
      try {
        const data = await quizService.getAttemptDetail(attemptId);
        setAttempt(data);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load attempt');
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-secondary-50 dark:bg-secondary-900">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-1/4 h-4 mb-4 rounded bg-secondary-200 dark:bg-secondary-700"></div>
                  <div className="w-3/4 h-3 mb-2 rounded bg-secondary-200 dark:bg-secondary-700"></div>
                  <div className="w-1/2 h-3 rounded bg-secondary-200 dark:bg-secondary-700"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen py-8 bg-secondary-50 dark:bg-secondary-900">
        <div className="max-w-3xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-3 text-xl font-semibold text-secondary-900 dark:text-white">Attempt not found</h2>
              <p className="mb-6 text-secondary-600 dark:text-secondary-400">{error || 'We could not find this attempt.'}</p>
              <Link to="/history">
                <Button variant="outline">
                  <ArrowLeft className="mr-2" size={16} />
                  Back to History
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">{typeof attempt.categoryId === 'string' ? 'Attempt Details' : `${attempt.categoryId.name} - Attempt Details`}</h1>
              <p className="text-secondary-600 dark:text-secondary-400">
                Score: {attempt.score}/{attempt.total} • {attempt.percentage}% • {new Date(attempt.createdAt).toLocaleString()}
              </p>
            </div>
            <Link to="/history">
              <Button variant="outline">
                <ArrowLeft className="mr-2" size={16} /> Back
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="space-y-4">
          {attempt.detail.map((d, idx) => {
            const qId = typeof d.questionId === 'string' ? d.questionId : d.questionId._id;
            return (
              <Card key={qId} hover>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-medium text-secondary-900 dark:text-white">Question {idx + 1}</h3>
                  {typeof d.questionId === 'string' ? (
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Question ID: {d.questionId}</p>
                  ) : (
                    <>
                      <p className="mb-2 text-sm text-secondary-600 dark:text-secondary-400">{d.questionId.text}</p>
                      <div className="space-y-2">
                        {d.questionId.options.map((opt, optIdx) => {
                          const isSelected = d.selectedIndex === optIdx;
                          const isCorrect = (d.questionId as any).correctIndex === optIdx;
                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-lg border transition-colors flex items-start gap-3 ${isSelected ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800'}`}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${isSelected ? 'bg-primary-600 text-white' : 'border border-secondary-300 text-secondary-700 dark:text-secondary-300'}`}>
                                {String.fromCharCode(65 + optIdx)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-secondary-900 dark:text-white">{opt}</div>
                                  <div>
                                    {isCorrect && (
                                      <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded">Correct</span>
                                    )}
                                    {isSelected && !isCorrect && (
                                      <span className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded">Your answer</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                {d.correct ? (
                  <span className="inline-flex items-center px-2 py-1 text-sm text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                    <Check size={16} className="mr-1" /> Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 text-sm text-red-700 bg-red-100 rounded-full dark:bg-red-900 dark:text-red-300">
                    <X size={16} className="mr-1" /> Incorrect
                  </span>
                )}
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

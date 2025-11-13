import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { quizService } from '@/services/api';
import { Attempt } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, Award, Eye, RotateCcw } from 'lucide-react';

export const History: React.FC = () => {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async (pageNum: number = 1) => {
    try {
      const response = await quizService.getUserAttempts(pageNum, 10);
      if (pageNum === 1) {
        setAttempts(response.attempts);
      } else {
        setAttempts(prev => [...prev, ...response.attempts]);
      }
      setHasMore(pageNum < response.pagination.pages);
    } catch (error) {
      console.error('Error loading attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadAttempts(nextPage);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && attempts.length === 0) {
    return (
      <div className="min-h-screen py-12 bg-secondary-50 dark:bg-secondary-900">
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

  return (
    <div className="min-h-screen py-8 bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Quiz History
          </h1>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">
            Review your past quiz attempts and track your progress
          </p>
        </motion.div>

        {attempts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <Card>
              <CardContent className="p-12">
                <Award className="mx-auto mb-4 text-secondary-400" size={64} />
                <h3 className="mb-2 text-lg font-semibold text-secondary-900 dark:text-white">
                  No Quiz History Yet
                </h3>
                <p className="mb-6 text-secondary-600 dark:text-secondary-400">
                  Take your first quiz to start tracking your progress!
                </p>
                <Link to="/categories">
                  <Button size="lg">
                    Explore Categories
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4">
              {attempts.map((attempt, index) => (
                <motion.div
                  key={attempt._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <h3 className="mb-2 text-lg font-semibold text-secondary-900 dark:text-white">
                              {typeof attempt.categoryId === 'string' ? 'Unknown Category' : attempt.categoryId.name}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-secondary-600 dark:text-secondary-400">
                            <div className="flex items-center space-x-1">
                              <Calendar size={16} />
                              <span>{formatDate(attempt.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={16} />
                              <span>{attempt.score}/{attempt.total} correct</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className={`text-2xl font-bold ${getScoreColor(attempt.percentage)}`}>
                              {attempt.percentage}%
                            </div>
                            <div className="w-32 h-2 rounded-full bg-secondary-200 dark:bg-secondary-700">
                              <div 
                                className="h-2 transition-all duration-300 rounded-full bg-primary-600"
                                style={{ width: `${attempt.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {(() => {
                            const categoryId = typeof attempt.categoryId === 'string'
                              ? attempt.categoryId
                              : attempt.categoryId?._id;
                            return (
                              <Link to={categoryId ? `/quiz/${categoryId}` : '/categories'}>
                                <Button variant="outline" size="sm">
                                  <RotateCcw className="mr-1" size={16} />
                                  Retake
                                </Button>
                              </Link>
                            );
                          })()}
                          <Link to={`/attempts/${attempt._id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-1" size={16} />
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-center"
              >
                <Button
                  onClick={loadMore}
                  variant="outline"
                  loading={loading}
                >
                  Load More
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
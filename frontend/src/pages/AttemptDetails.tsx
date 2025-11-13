import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { quizService } from '@/services/api';
import { Attempt } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Trophy, 
  Clock, 
  Calendar,
  BarChart3,
  Target,
  Award,
  BookOpen,
  ChevronRight,
  Star,
  Zap,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

export const AttemptDetails: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchAttempt = async () => {
      if (!attemptId) return;
      try {
        const data = await quizService.getAttemptDetail(attemptId);
        setAttempt(data);
        // Expand all questions by default
        const allQuestions = new Set(data.detail.map((_, index) => index));
        setExpandedQuestions(allQuestions);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load attempt details');
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [attemptId]);

  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-green-600';
    if (percentage >= 60) return 'from-yellow-500 to-yellow-600';
    if (percentage >= 40) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getPerformanceText = (percentage: number) => {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good job!';
    if (percentage >= 40) return 'Keep practicing!';
    return 'Needs improvement';
  };

  const getPerformanceIcon = (percentage: number) => {
    if (percentage >= 80) return <Trophy className="text-yellow-400" size={20} />;
    if (percentage >= 60) return <Star className="text-green-400" size={20} />;
    if (percentage >= 40) return <Lightbulb className="text-blue-400" size={20} />;
    return <Zap className="text-orange-400" size={20} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-1/2 h-4 mb-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div className="w-3/4 h-8 bg-gray-200 rounded dark:bg-gray-700"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-3/4 h-4 mb-3 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div className="w-1/2 h-3 mb-2 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div className="w-full h-3 bg-gray-200 rounded dark:bg-gray-700"></div>
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
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-4 text-gray-400 dark:text-gray-500">
                <BarChart3 size={64} className="mx-auto" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                Attempt Not Found
              </h2>
              <p className="max-w-md mx-auto mb-6 text-gray-600 dark:text-gray-400">
                {error || "We couldn't find the attempt you're looking for. It may have been deleted or you might not have permission to view it."}
              </p>
              <Link to="/history">
                <Button className="gap-2 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
                  <ArrowLeft size={18} />
                  Back to Quiz History
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const correctAnswers = attempt.detail.filter(d => d.correct).length;
  const totalQuestions = attempt.detail.length;
  const percentage = attempt.percentage;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 text-white shadow-lg rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                <BarChart3 size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
                  Attempt Analysis
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed breakdown of your quiz performance
                </p>
              </div>
            </div>
          </div>
          <Link to="/history">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={16} />
              Back to History
            </Button>
          </Link>
        </motion.div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Overall Score',
              value: `${percentage}%`,
              description: getPerformanceText(percentage),
              color: getPerformanceColor(percentage),
              icon: <Trophy size={20} />
            },
            {
              label: 'Correct Answers',
              value: `${correctAnswers}/${totalQuestions}`,
              description: `${Math.round((correctAnswers / totalQuestions) * 100)}% accuracy`,
              color: 'from-green-500 to-green-600',
              icon: <Check size={20} />
            },
            {
              label: 'Category',
              value: typeof attempt.categoryId === 'string' ? 'General' : attempt.categoryId.name,
              description: 'Quiz category',
              color: 'from-purple-500 to-purple-600',
              icon: <BookOpen size={20} />
            },
            {
              label: 'Completion Time',
              value: new Date(attempt.createdAt).toLocaleDateString(),
              description: new Date(attempt.createdAt).toLocaleTimeString(),
              color: 'from-orange-500 to-orange-600',
              icon: <Calendar size={20} />
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="transition-shadow border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Performance Summary
                </h3>
                <div className="flex items-center gap-2">
                  {getPerformanceIcon(percentage)}
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {getPerformanceText(percentage)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{percentage}%</span>
                </div>
                
                <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700">
                  <div 
                    className={`h-3 rounded-full bg-gradient-to-r ${getPerformanceColor(percentage)} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Check size={16} />
                    <span>{correctAnswers} correct</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <X size={16} />
                    <span>{totalQuestions - correctAnswers} incorrect</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Questions Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Questions Breakdown
            </h2>
            <Badge variant="outline" className="text-sm">
              {totalQuestions} questions
            </Badge>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {attempt.detail.map((detail, index) => {
                const question = typeof detail.questionId === 'string' ? null : detail.questionId;
                const isExpanded = expandedQuestions.has(index);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden transition-shadow border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-md">
                      <CardContent className="p-0">
                        {/* Question Header */}
                        <button
                          onClick={() => toggleQuestion(index)}
                          className="flex items-center justify-between w-full p-6 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                              detail.correct 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {detail.correct ? <Check size={20} /> : <X size={20} />}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                Question {index + 1}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {question ? question.text : 'Question details not available'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={detail.correct ? "solid" : "outline"}
                              className={`gap-1 ${
                                detail.correct
                                  ? 'text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-300'
                                  : 'text-red-800 bg-red-100 dark:bg-red-900/30 dark:text-red-300'
                              }`}
                            >
                              {detail.correct ? 'Correct' : 'Incorrect'}
                            </Badge>
                            <ChevronRight 
                              size={20} 
                              className={`text-gray-400 transition-transform ${
                                isExpanded ? 'rotate-90' : ''
                              }`}
                            />
                          </div>
                        </button>

                        {/* Question Details */}
                        <AnimatePresence>
                          {isExpanded && question && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="px-6 pt-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                                      Question:
                                    </h4>
                                    <p className="p-4 text-gray-700 rounded-lg dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50">
                                      {question.text}
                                    </p>
                                  </div>

                                  <div>
                                    <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                                      Options:
                                    </h4>
                                    <div className="space-y-3">
                                      {question.options.map((option, optionIndex) => {
                                        const isSelected = detail.selectedIndex === optionIndex;
                                        const isCorrect = question.correctIndex === optionIndex;
                                        
                                        return (
                                          <div
                                            key={optionIndex}
                                            className={`p-4 rounded-xl border-2 transition-all ${
                                              isCorrect
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400'
                                                : isSelected
                                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400'
                                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                            }`}
                                          >
                                            <div className="flex items-start gap-3">
                                              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold ${
                                                isCorrect
                                                  ? 'bg-green-500 text-white'
                                                  : isSelected
                                                  ? 'bg-red-500 text-white'
                                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                              }`}>
                                                {String.fromCharCode(65 + optionIndex)}
                                              </div>
                                              <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                  <p className="text-gray-900 dark:text-white">
                                                    {option}
                                                  </p>
                                                  <div className="flex items-center gap-2">
                                                    {isCorrect && (
                                                      <Badge className="gap-1 text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                                                        <Check size={12} />
                                                        Correct Answer
                                                      </Badge>
                                                    )}
                                                    {isSelected && !isCorrect && (
                                                      <Badge className="gap-1 text-red-800 bg-red-100 dark:bg-red-900/30 dark:text-red-300">
                                                        <X size={12} />
                                                        Your Answer
                                                      </Badge>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {!detail.correct && (
                                    <div className="p-4 border border-blue-200 rounded-xl bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                                      <div className="flex items-center gap-2 mb-2 text-blue-800 dark:text-blue-300">
                                        <Lightbulb size={16} />
                                        <span className="font-medium">Learning Tip</span>
                                      </div>
                                      <p className="text-sm text-blue-700 dark:text-blue-400">
                                        Review this question and understand why the correct answer is right. 
                                        This will help you improve in future attempts.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col justify-center gap-4 pt-6 sm:flex-row"
        >
          <Link to="/history" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft size={16} />
              Back to History
            </Button>
          </Link>
          {typeof attempt.categoryId !== 'string' && (
            <Link to={`/quiz/${attempt.categoryId._id}`} className="flex-1 sm:flex-none">
              <Button className="w-full gap-2 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
                <Target size={16} />
                Retry This Quiz
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
};
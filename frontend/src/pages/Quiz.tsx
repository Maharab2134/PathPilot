import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { quizService, categoryService } from '@/services/api';
import { Question, Category, QuizSubmission } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { APP_CONFIG } from '@/utils/constants';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  XCircle
} from 'lucide-react';

export const Quiz: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(APP_CONFIG.QUIZ_TIME_LIMIT);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Prevent admins from accessing quiz page
    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }

    const loadQuiz = async () => {
      try {
        const [questionsData, categoryData] = await Promise.all([
          quizService.getRandomQuestions(categoryId!),
          categoryService.getById(categoryId!)
        ]);
        
        setQuestions(questionsData);
        setCategory(categoryData);
      } catch (error) {
        console.error('Error loading quiz:', error);
        navigate('/categories');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [categoryId, user, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (questionId: string, selectedIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      const submission: QuizSubmission = {
        categoryId: categoryId!,
        answers: questions.map(question => ({
          questionId: question._id,
          selectedIndex: answers[question._id] ?? -1
        }))
      };

      const result = await quizService.submitQuiz(submission);
      navigate('/quiz-result', { state: { result } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600 dark:text-secondary-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <XCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
              Quiz Not Available
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              Unable to load questions for this category.
            </p>
            <Button onClick={() => navigate('/categories')}>
              Back to Categories
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers[currentQ._id];

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                    {category?.name} Quiz
                  </h1>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-red-500">
                    <Clock size={20} />
                    <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <CheckCircle size={20} className="text-green-500" />
                    <span className="text-secondary-600 dark:text-secondary-400">
                      {answeredCount}/{questions.length} answered
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <h3 className="font-semibold text-secondary-900 dark:text-white">
                  Questions
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {questions.map((question, index) => (
                    <button
                      key={question._id}
                      onClick={() => setCurrentQuestion(index)}
                      className={`
                        w-10 h-10 rounded-lg border-2 text-sm font-medium transition-colors
                        ${currentQuestion === index
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : answers[question._id] !== undefined
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300'
                        }
                      `}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                          Question {currentQuestion + 1}
                        </span>
                        <span className="text-sm text-secondary-500 dark:text-secondary-400">
                          {currentQ.difficulty}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
                        {currentQ.text}
                      </h2>

                      <div className="space-y-3">
                        {currentQ.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(currentQ._id, index)}
                            className={`
                              w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                              ${selectedAnswer === index
                                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100'
                                : 'border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:border-primary-400 dark:hover:border-primary-600'
                              }
                            `}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium
                                ${selectedAnswer === index
                                  ? 'border-primary-600 bg-primary-600 text-white'
                                  : 'border-secondary-300 dark:border-secondary-600'
                                }
                              `}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span>{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t border-secondary-200 dark:border-secondary-700">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                      >
                        <ArrowLeft className="mr-2" size={16} />
                        Previous
                      </Button>

                      {currentQuestion === questions.length - 1 ? (
                        <Button
                          onClick={handleSubmit}
                          loading={submitting}
                          disabled={answeredCount < questions.length}
                        >
                          Submit Quiz
                          <CheckCircle className="ml-2" size={16} />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNext}
                          disabled={selectedAnswer === undefined}
                        >
                          Next Question
                          <ArrowRight className="ml-2" size={16} />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
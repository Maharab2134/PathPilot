import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Attempt, CareerInfo } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Trophy, 
  Award, 
  BookOpen, 
  Youtube, 
  Share2,
  RotateCcw,
  Home
} from 'lucide-react';

interface QuizResultState {
  result: {
    attempt: Attempt;
    careerRecommendation: CareerInfo | null;
    passed: boolean;
  };
}

export const QuizResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as QuizResultState;

  if (!state?.result) {
    navigate('/categories');
    return null;
  }

  const { attempt, careerRecommendation, passed } = state.result;
  const percentage = attempt.percentage;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding! You have exceptional knowledge in this field.';
    if (score >= 80) return 'Excellent work! You have strong understanding of this subject.';
    if (score >= 70) return 'Good job! You have a solid foundation in this area.';
    if (score >= 60) return 'Not bad! With some more practice, you can improve significantly.';
    return 'Keep learning! Review the materials and try again.';
  };

  return (
    <div className="min-h-screen py-8 bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900">
            <Trophy className="text-primary-600 dark:text-primary-400" size={40} />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-secondary-900 dark:text-white">
            Quiz Completed!
          </h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-400">
            {getScoreMessage(percentage)}
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="flex-1">
                  <div className={`text-5xl md:text-6xl font-bold ${getScoreColor(percentage)} mb-2`}>
                    {percentage}%
                  </div>
                  <div className="text-secondary-600 dark:text-secondary-400">
                    {attempt.score} out of {attempt.total} questions correct
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <Award className="text-yellow-500" size={24} />
                    <span className="text-lg font-semibold text-secondary-900 dark:text-white">
                      {passed ? 'Career Path Unlocked!' : 'Keep Learning!'}
                    </span>
                  </div>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    {passed 
                      ? 'Congratulations! You qualify for career recommendations.'
                      : 'Score 70% or higher to unlock career recommendations.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col justify-center gap-4 mb-12 sm:flex-row"
        >
          {(() => {
            const categoryId = typeof attempt.categoryId === 'string'
              ? attempt.categoryId
              : attempt.categoryId?._id;
            if (!categoryId) return (
              <Link to="/categories">
                <Button variant="outline" size="lg">
                  <RotateCcw className="mr-2" size={18} />
                  Retake Quiz
                </Button>
              </Link>
            );
            return (
              <Link to={`/quiz/${categoryId}`}>
                <Button variant="outline" size="lg">
                  <RotateCcw className="mr-2" size={18} />
                  Retake Quiz
                </Button>
              </Link>
            );
          })()}
          <Link to="/categories">
            <Button variant="outline" size="lg">
              <Home className="mr-2" size={18} />
              Back to Categories
            </Button>
          </Link>
          <Button variant="primary" size="lg">
            <Share2 className="mr-2" size={18} />
            Share Results
          </Button>
        </motion.div>

  {/* Career Recommendation */}
  {careerRecommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                  Recommended Career: {careerRecommendation.title}
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-secondary-900 dark:text-white">
                    About this Career
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    {careerRecommendation.description}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-secondary-900 dark:text-white">
                    Key Skills Required
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {careerRecommendation.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learning Path */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-secondary-900 dark:text-white">
                    Learning Path
                  </h3>
                  <ol className="space-y-2">
                    {careerRecommendation.learningPath.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-sm text-white rounded-full bg-primary-600">
                          {index + 1}
                        </span>
                        <span className="text-secondary-600 dark:text-secondary-400">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

               {/* Resources */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
  {careerRecommendation.youtubeLinks.length > 0 && (
    <Card hover>
      <CardContent className="p-4">
        <Youtube className="mb-3 text-red-500" size={32} />
        <h4 className="mb-2 font-semibold text-secondary-900 dark:text-white">
          YouTube Resources
        </h4>
        <div className="space-y-2">
          {careerRecommendation.youtubeLinks.slice(0, 3).map((link, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm truncate text-primary-600 dark:text-primary-400 hover:underline"
            >
              {new URL(link).hostname}
            </a>
          ))}
        </div>
        {careerRecommendation.youtubeLinks.length > 3 && (
          <p className="mt-2 text-xs text-secondary-500 dark:text-secondary-400">
            +{careerRecommendation.youtubeLinks.length - 3} more resources
          </p>
        )}
      </CardContent>
    </Card>
  )}

  {careerRecommendation.bookLinks.length > 0 && (
    <Card hover>
      <CardContent className="p-4">
        <BookOpen className="mb-3 text-blue-500" size={32} />
        <h4 className="mb-2 font-semibold text-secondary-900 dark:text-white">
          Recommended Books
        </h4>
        <div className="space-y-2">
          {careerRecommendation.bookLinks.slice(0, 3).map((link, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm truncate text-primary-600 dark:text-primary-400 hover:underline"
            >
              {new URL(link).hostname}
            </a>
          ))}
        </div>
        {careerRecommendation.bookLinks.length > 3 && (
          <p className="mt-2 text-xs text-secondary-500 dark:text-secondary-400">
            +{careerRecommendation.bookLinks.length - 3} more books
          </p>
        )}
      </CardContent>
    </Card>
  )}

  {careerRecommendation.courseLinks.length > 0 && (
    <Card hover>
      <CardContent className="p-4">
        <Award className="mb-3 text-green-500" size={32} />
        <h4 className="mb-2 font-semibold text-secondary-900 dark:text-white">
          Online Courses
        </h4>
        <div className="space-y-2">
          {careerRecommendation.courseLinks.slice(0, 3).map((link, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm truncate text-primary-600 dark:text-primary-400 hover:underline"
            >
              {new URL(link).hostname}
            </a>
          ))}
        </div>
        {careerRecommendation.courseLinks.length > 3 && (
          <p className="mt-2 text-xs text-secondary-500 dark:text-secondary-400">
            +{careerRecommendation.courseLinks.length - 3} more courses
          </p>
        )}
      </CardContent>
    </Card>
  )}
</div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};
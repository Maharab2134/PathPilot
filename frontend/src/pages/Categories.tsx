import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { categoryService } from '@/services/api';
import { Category } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, Users, Clock, Award } from 'lucide-react';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-secondary-50 dark:bg-secondary-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-3/4 h-4 mb-4 rounded bg-secondary-200 dark:bg-secondary-700"></div>
                  <div className="w-full h-3 mb-2 rounded bg-secondary-200 dark:bg-secondary-700"></div>
                  <div className="w-5/6 h-3 rounded bg-secondary-200 dark:bg-secondary-700"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-secondary-50 dark:bg-secondary-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-secondary-900 dark:text-white">
            Explore Career Categories
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-secondary-600 dark:text-secondary-400">
            Choose a category that interests you and take a quiz to discover 
            your potential in that career field.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <CardContent className="flex flex-col h-full p-6">
                  <div className="flex-1">
                    <h3 className="mb-3 text-xl font-semibold text-secondary-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="mb-4 text-secondary-600 dark:text-secondary-400">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center mb-4 space-x-4 text-sm text-secondary-500 dark:text-secondary-400">
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>30 min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award size={16} />
                        <span>20 questions</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {user ? (
                      user.role === 'admin' ? (
                        <Button className="w-full" size="lg" variant="outline" disabled>
                          <Play className="mr-2" size={18} />
                          Admins cannot take quizzes
                        </Button>
                      ) : (
                        <Link to={`/quiz/${category._id}`} className="block">
                          <Button className="w-full" size="lg">
                            <Play className="mr-2" size={18} />
                            Start Quiz
                          </Button>
                        </Link>
                      )
                    ) : (
                      <Link to="/login">
                        <Button className="w-full" size="lg">
                          <Play className="mr-2" size={18} />
                          Sign In to Start
                        </Button>
                      </Link>
                    )}
                    
                    <Link to={`/leaderboard?category=${category._id}`} className='block'>
                      <Button variant="outline" className="w-full">
                        <Users className="mr-2" size={16} />
                        View Leaderboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <div className="mb-4 text-secondary-400 dark:text-secondary-600">
              <Users size={64} className="mx-auto" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-secondary-900 dark:text-white">
              No Categories Available
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              Check back later for new career categories.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
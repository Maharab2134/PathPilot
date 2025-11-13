import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { quizService, categoryService, authService } from '@/services/api';
import { Category } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, Medal, Crown, Users, Target } from 'lucide-react';

interface LeaderboardEntry {
  _id: string;
  bestScore: number;
  latestAttempt: any;
  user: {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export const Leaderboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ _id?: string; role?: string } | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const profile = await authService.getProfile();
        setCurrentUser(profile);
      } catch (err) {
        // not logged in or failed to fetch profile
        setCurrentUser(null);
      }
    };

    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadLeaderboard();
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
      if (!selectedCategory && data.length > 0) {
        setSelectedCategory(data[0]._id);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await quizService.getLeaderboard(selectedCategory, 20);
      setLeaderboard(data);
      setSearchParams({ category: selectedCategory });
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="text-yellow-500" size={24} />;
      case 1:
        return <Medal className="text-gray-400" size={24} />;
      case 2:
        return <Medal className="text-amber-600" size={24} />;
      default:
        return <div className="w-6 h-6 font-semibold text-center text-secondary-500">{index + 1}</div>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'from-yellow-400 to-yellow-600 text-white';
      case 1:
        return 'from-gray-400 to-gray-600 text-white';
      case 2:
        return 'from-amber-600 to-amber-800 text-white';
      default:
        return 'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white';
    }
  };

  return (
    <div className="min-h-screen py-8 bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900">
            <Trophy className="text-primary-600 dark:text-primary-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Leaderboard
          </h1>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">
            Top performers across different career categories
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2">
                  <Target size={20} className="text-secondary-500" />
                  <span className="font-medium text-secondary-700 dark:text-secondary-300">
                    Select Category:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category._id}
                      onClick={() => setSelectedCategory(category._id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === category._id
                          ? 'bg-primary-600 text-white'
                          : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-300 dark:hover:bg-secondary-600'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  Top Performers
                </h2>
                <div className="flex items-center space-x-2 text-secondary-500">
                  <Users size={20} />
                  <span>{leaderboard.length} participants</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 mx-auto border-b-2 rounded-full animate-spin border-primary-600"></div>
                  <p className="mt-2 text-secondary-600 dark:text-secondary-400">Loading leaderboard...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="p-8 text-center">
                  <Trophy className="mx-auto mb-4 text-secondary-400" size={48} />
                  <h3 className="mb-2 text-lg font-semibold text-secondary-900 dark:text-white">
                    No Data Available
                  </h3>
                  <p className="mb-4 text-secondary-600 dark:text-secondary-400">
                    Be the first to take a quiz in this category!
                  </p>
                  <Link to="/categories">
                    <Button>
                      Take a Quiz
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-6 ${
                        index < 3 
                          ? `bg-gradient-to-r ${getRankColor(index)}`
                          : 'bg-white dark:bg-secondary-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8">
                            {getRankIcon(index)}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary-200 dark:bg-secondary-700">
                              {entry.user.avatarUrl ? (
                                <img
                                  src={entry.user.avatarUrl}
                                  alt={entry.user.name}
                                  className="object-cover w-10 h-10 rounded-full"
                                />
                              ) : (
                                <Users size={20} className="text-secondary-500" />
                              )}
                            </div>
                            <div>
                              <div className={`font-semibold ${
                                index < 3 ? 'text-white' : 'text-secondary-900 dark:text-white'
                              }`}>
                                {entry.user.name}
                              </div>
                              <div className={`text-sm ${
                                index < 3 ? 'text-white/80' : 'text-secondary-500 dark:text-secondary-400'
                              }`}>
                                  {(() => {
                                    const canView = currentUser && (currentUser.role === 'admin' || currentUser._id === entry.user._id);
                                    return canView ? entry.user.email : 'Private';
                                  })()}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            index < 3 ? 'text-white' : 'text-primary-600 dark:text-primary-400'
                          }`}>
                            {entry.bestScore}%
                          </div>
                          <div className={`text-sm ${
                            index < 3 ? 'text-white/80' : 'text-secondary-500 dark:text-secondary-400'
                          }`}>
                            Best Score
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
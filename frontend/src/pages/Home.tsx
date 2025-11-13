import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  ArrowRight, 
  Brain, 
  Target, 
  TrendingUp, 
  Users
} from 'lucide-react';

export const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'Smart Career Assessment',
      description: 'Take intelligent quizzes that analyze your skills and interests to recommend perfect career paths.'
    },
    {
      icon: Target,
      title: 'Personalized Recommendations',
      description: 'Get tailored career suggestions based on your quiz performance and learning preferences.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed analytics and historical performance data.'
    },
    {
      icon: Users,
      title: 'Community Leaderboard',
      description: 'Compete with others and see where you stand in your chosen career categories.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Users Empowered' },
    { number: '50+', label: 'Career Paths' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Available' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-primary-900/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-white mb-6">
              Discover Your
              <span className="text-primary-600 dark:text-primary-400 block">Dream Career</span>
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8 max-w-3xl mx-auto">
              Take intelligent career assessments, get personalized recommendations, 
              and embark on your journey to professional success with PathPilot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link to="/categories">
                  <Button size="lg" className="text-lg px-8 py-4">
                    Start Exploring
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="text-lg px-8 py-4">
                      Get Started Free
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                      Learn More
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Why Choose PathPilot?
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Our platform combines advanced assessment technology with personalized 
              guidance to help you find your ideal career path.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card hover animated={false} className="h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="text-primary-600 dark:text-primary-400" size={24} />
                      </div>
                      <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-secondary-600 dark:text-secondary-400">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary-50 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-secondary-600 dark:text-secondary-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Discover Your Path?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who have found their ideal career through our 
              intelligent assessment platform.
            </p>
            {!user && (
              <Link to="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                  Start Your Journey Today
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};
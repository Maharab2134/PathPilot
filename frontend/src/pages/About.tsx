import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Target, 
  Users, 
  Rocket, 
  Award, 
  Heart
} from 'lucide-react';

export const About: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To empower individuals with intelligent career guidance and personalized learning paths.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Building a supportive community where learners can grow and succeed together.'
    },
    {
      icon: Rocket,
      title: 'Innovation',
      description: 'Leveraging cutting-edge technology to provide accurate career assessments.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality career guidance and resources.'
    }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      description: 'Former career counselor with 10+ years in education technology.',
      avatar: '/images/team/sarah.jpg'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO',
      description: 'Full-stack developer passionate about AI and machine learning.',
      avatar: '/images/team/marcus.jpg'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Head of Psychology',
      description: 'Industrial-organizational psychologist specializing in career assessment.',
      avatar: '/images/team/emily.jpg'
    },
    {
      name: 'Alex Thompson',
      role: 'Product Designer',
      description: 'UX designer focused on creating intuitive career discovery experiences.',
      avatar: '/images/team/alex.jpg'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Users Helped' },
    { number: '100+', label: 'Career Paths' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '25+', label: 'Countries' }
  ];

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About PathPilot
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
              We're on a mission to help people discover their ideal career paths 
              through intelligent assessment and personalized guidance.
            </p>
            <Link to="/categories">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Start Your Journey
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white dark:bg-secondary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-6">
              Our Story
            </h2>
            <div className="space-y-6 text-lg text-secondary-600 dark:text-secondary-400 text-left">
              <p>
                PathPilot was born from a simple observation: too many people feel lost 
                when it comes to choosing a career path. Traditional career tests often 
                provide generic results that don't account for individual learning styles, 
                interests, and market realities.
              </p>
              <p>
                Our team of career counselors, psychologists, and technologists came 
                together to create a more intelligent approach. We combine proven 
                psychological assessment methods with real-time market data to provide 
                personalized career recommendations that actually make sense.
              </p>
              <p>
                Today, we've helped thousands of users discover fulfilling career paths 
                and provided them with the resources they need to succeed in their chosen fields.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary-50 dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              These principles guide everything we do at PathPilot
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="h-full text-center">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="text-primary-600 dark:text-primary-400" size={32} />
                      </div>
                      <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">
                        {value.title}
                      </h3>
                      <p className="text-secondary-600 dark:text-secondary-400">
                        {value.description}
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
      <section className="py-16 bg-primary-600 dark:bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Passionate professionals dedicated to your career success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="text-center">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 bg-secondary-200 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                      <Users className="text-secondary-400" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-900 to-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Heart className="mx-auto mb-6 text-primary-300" size={48} />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Discover Your Path?
            </h2>
            <p className="text-xl text-secondary-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have found their ideal career through our platform.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
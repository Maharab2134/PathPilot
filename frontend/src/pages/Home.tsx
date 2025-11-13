import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowRight, 
  Brain, 
  Target, 
  TrendingUp, 
  Users,
  Star,
  Zap,
  Rocket,
  Award,
  BookOpen,
  Shield,
  Clock,
  CheckCircle,
  Play,
  Sparkles,
  GraduationCap,
  Lightbulb,
  BarChart3,
  Heart
} from 'lucide-react';

export const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Assessment',
      description: 'Advanced algorithms analyze your skills and interests to provide accurate career recommendations.',
      color: 'from-purple-500 to-pink-500',
      iconColor: 'text-purple-600'
    },
    {
      icon: Target,
      title: 'Personalized Career Paths',
      description: 'Get tailored roadmaps with step-by-step guidance for your chosen career direction.',
      color: 'from-blue-500 to-cyan-500',
      iconColor: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Track your growth with detailed insights and performance metrics over time.',
      color: 'from-green-500 to-emerald-500',
      iconColor: 'text-green-600'
    },
    {
      icon: Users,
      title: 'Smart Community',
      description: 'Connect with peers and mentors in your chosen career field for guidance.',
      color: 'from-orange-500 to-red-500',
      iconColor: 'text-orange-600'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Career Discoveries', icon: Rocket, change: '+25% this month' },
    { number: '95%', label: 'User Satisfaction', icon: Star, change: 'Rated 4.8+ stars' },
    { number: '200+', label: 'Career Paths', icon: BookOpen, change: 'Constantly growing' },
    { number: '24/7', label: 'AI Support', icon: Shield, change: 'Always available' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Developer',
      content: 'PathPilot helped me transition from marketing to tech. The personalized learning path was exactly what I needed!',
      avatar: 'SC',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Data Scientist',
      content: 'The career assessment pinpointed my strengths perfectly. I found my dream job in just 3 months!',
      avatar: 'MJ',
      rating: 5
    },
    {
      name: 'Elena Rodriguez',
      role: 'UX Designer',
      content: 'Amazing platform! The community support and detailed analytics kept me motivated throughout my journey.',
      avatar: 'ER',
      rating: 5
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Take Assessment',
      description: 'Complete our smart quiz to discover your strengths and interests',
      icon: Brain
    },
    {
      step: '02',
      title: 'Get Recommendations',
      description: 'Receive personalized career suggestions based on your results',
      icon: Lightbulb
    },
    {
      step: '03',
      title: 'Follow Learning Path',
      description: 'Access curated resources and step-by-step guidance',
      icon: GraduationCap
    },
    {
      step: '04',
      title: 'Achieve Success',
      description: 'Land your dream job with our career preparation tools',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
        <div className="absolute rounded-full top-1/4 left-1/4 w-72 h-72 bg-purple-300/20 blur-3xl dark:bg-purple-600/10"></div>
        <div className="absolute rounded-full bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 blur-3xl dark:bg-blue-600/10"></div>
        
        <div className="relative px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-gray-200 rounded-full shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm dark:border-gray-700"
            >
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Trusted by 50,000+ career changers
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="mb-6 text-5xl font-bold md:text-7xl lg:text-8xl">
              <span className="text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text">
                Find Your
              </span>
              <br />
              <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text">
                Dream Career
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-4xl mx-auto mb-8 text-xl leading-relaxed text-gray-600 md:text-2xl dark:text-gray-400">
              Discover your perfect career path with our AI-powered assessment platform. 
              Get personalized recommendations, learning resources, and community support to transform your professional life.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col items-center justify-center gap-4 mb-12 sm:flex-row"
            >
              {user ? (
                <Link to="/categories">
                  <Button size="lg" className="px-12 py-6 text-lg transition-all duration-300 border-0 shadow-2xl rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-3xl">
                    <Play className="mr-3" size={24} />
                    Continue Your Journey
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="px-12 py-6 text-lg transition-all duration-300 border-0 shadow-2xl rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-3xl">
                      <Rocket className="mr-3" size={24} />
                      Start Free Assessment
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" size="lg" className="px-8 py-6 text-lg transition-colors border-2 border-gray-300 rounded-2xl dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400">
                      <Zap className="mr-2" size={20} />
                      How It Works
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Stats Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-8 text-center"
            >
              {stats.slice(0, 3).map((stat, index) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                  {index < 2 && (
                    <div className="w-1 h-1 bg-gray-300 rounded-full dark:bg-gray-600"></div>
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute transform -translate-x-1/2 bottom-8 left-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center w-6 h-10 border-2 border-gray-300 rounded-full dark:border-gray-600"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 mt-2 bg-gray-400 rounded-full dark:bg-gray-500"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <Badge variant="outline" className="mb-4 text-sm font-semibold">
              ✨ WHY CHOOSE US
            </Badge>
            <h2 className="mb-4 text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
              Smart Career Discovery
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
              Our platform combines cutting-edge AI with human expertise to guide you 
              toward careers that match your unique strengths and passions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full overflow-hidden transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl">
                    <CardContent className="relative p-8">
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="text-white" size={28} />
                      </div>
                      
                      {/* Content */}
                      <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300">
                        {feature.title}
                      </h3>
                      <p className="leading-relaxed text-gray-600 dark:text-gray-400">
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

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <Badge variant="outline" className="mb-4 text-sm font-semibold">
              🚀 GET STARTED
            </Badge>
            <h2 className="mb-4 text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
              Your Journey in 4 Steps
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-700 dark:to-purple-700 z-0"></div>
                  )}
                  
                  <Card className="relative z-10 text-center transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl group">
                    <CardContent className="p-8">
                      {/* Step Number */}
                      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-lg font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-500">
                        {step.step}
                      </div>
                      
                      {/* Icon */}
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-transform duration-300 bg-blue-100 rounded-2xl dark:bg-blue-900/30 group-hover:scale-110">
                        <Icon className="text-blue-600 dark:text-blue-400" size={28} />
                      </div>
                      
                      {/* Content */}
                      <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {step.description}
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
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="p-8 transition-all duration-300 border border-gray-100 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl hover:shadow-xl dark:border-gray-700">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 transition-transform duration-300 shadow-lg rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 group-hover:scale-110">
                      <Icon className="text-white" size={24} />
                    </div>
                    <div className="mb-2 text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
                      {stat.number}
                    </div>
                    <div className="mb-2 font-semibold text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      {stat.change}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-900/10 dark:to-pink-900/10">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <Badge variant="outline" className="mb-4 text-sm font-semibold">
              ❤️ SUCCESS STORIES
            </Badge>
            <h2 className="mb-4 text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
              Loved by Career Changers
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl">
                  <CardContent className="p-8">
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    
                    {/* Content */}
                    <p className="mb-6 italic leading-relaxed text-gray-600 dark:text-gray-300">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-500">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Ready to Transform Your Career?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-xl leading-relaxed text-blue-100">
              Join thousands of successful career changers who found their path with our intelligent platform. 
              Your dream career is just a few clicks away.
            </p>
            {!user && (
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/register">
                  <Button size="lg" className="px-12 py-6 text-lg font-bold text-blue-600 transition-all duration-300 bg-white border-0 shadow-2xl rounded-2xl hover:bg-gray-100 hover:shadow-3xl">
                    <Rocket className="mr-3" size={24} />
                    Start Free Today
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg text-white transition-all duration-300 border-2 border-white rounded-2xl hover:bg-white hover:text-blue-600">
                    <Play className="mr-2" size={20} />
                    See Demos
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center justify-center gap-8 mt-12 text-blue-100 sm:flex-row"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm">15-Minute Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">No Credit Card Required</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  HelpCircle,
  MessageCircle,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Users,
  Shield,
  CreditCard,
  Smartphone,
  Zap,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

export const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: Zap, color: 'from-blue-500 to-cyan-500', count: 8 },
    { id: 'account', name: 'Account & Profile', icon: Users, color: 'from-purple-500 to-pink-500', count: 12 },
    // { id: 'billing', name: 'Billing & Plans', icon: CreditCard, color: 'from-green-500 to-emerald-500', count: 6 },
    { id: 'technical', name: 'Technical Issues', icon: Smartphone, color: 'from-orange-500 to-red-500', count: 10 },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield, color: 'from-indigo-500 to-blue-500', count: 7 },
    { id: 'other', name: 'Other Questions', icon: HelpCircle, color: 'from-gray-500 to-slate-500', count: 15 }
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I take my first career assessment?",
      answer: "To start your first career assessment, simply click on the 'Get Started' button on the homepage, choose a category that interests you, and begin the quiz. The assessment typically takes 15-20 minutes to complete.",
      category: 'getting-started',
      popular: true
    },
    {
      id: 2,
      question: "Can I retake assessments?",
      answer: "Yes, you can retake any assessment as many times as you'd like. We recommend waiting at least 2 weeks between attempts to see meaningful progress in your results.",
      category: 'account',
      popular: true
    },
    {
      id: 3,
      question: "How are my career recommendations generated?",
      answer: "Our AI analyzes your quiz responses, considering factors like your interests, skills, values, and personality traits. We compare this data with thousands of career paths to find the best matches for you.",
      category: 'technical'
    },
    {
      id: 4,
      question: "Is my personal data secure?",
      answer: "Absolutely. We use enterprise-grade encryption and follow strict data protection protocols. Your personal information is never shared with third parties without your explicit consent.",
      category: 'privacy',
      popular: true
    },
    {
      id: 5,
      question: "What payment methods do you accept?",
      answer: "We accept all major Nagad, bKash, and bank transfers. All payments are processed securely through our PCI-compliant payment partners.",
      category: 'billing'
    },
    {
      id: 6,
      question: "Can I download my assessment results?",
      answer: "Yes, you can download detailed PDF reports of your assessment results from your dashboard. Premium users get access to extended reports with additional insights.",
      category: 'account'
    },
    {
      id: 7,
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a secure link to reset your password. The link expires in 1 hour for security.",
      category: 'account'
    },
    {
      id: 8,
      question: "What's the difference between free and premium plans?",
      answer: "The free plan includes basic assessments and general career recommendations. Premium offers detailed analytics, personalized learning paths, one-on-one career coaching sessions, and advanced reporting features.",
      category: 'billing',
      popular: true
    }
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      responseTime: "Typically replies in 2 minutes",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      responseTime: "Typically replies in 4 hours",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Browse our comprehensive guides",
      responseTime: "Instant access",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    (activeCategory === 'all' || faq.category === activeCategory) &&
    (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    const categoryFromQuery = searchParams.get('category');
    if (categoryFromQuery) {
      setActiveCategory(categoryFromQuery);
    }
  }, []); // run once on mount

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleSetActiveCategory = (id: string) => {
    setActiveCategory(id);
    if (id === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: id });
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-gray-200 rounded-full shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm dark:border-gray-700">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              How can we help you?
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
            Help Center
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            Find answers to common questions, explore guides, and get support for your career journey.
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
            <Input
              placeholder="Search for answers... (e.g., 'password reset', 'billing', 'career recommendations')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-3 pl-12 pr-4 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6 mb-16 md:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSetActiveCategory(category.id)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-white dark:bg-gray-800 shadow-xl border-2 border-blue-500 dark:border-blue-400'
                    : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-lg hover:shadow-xl border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {category.count} articles
                  </Badge>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Browse questions about {category.name.toLowerCase()}
                </p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <Badge variant="outline" className="text-sm">
              {filteredFaqs.length} questions
            </Badge>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="flex items-center justify-between w-full p-6 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {faq.popular && (
                              <Badge className="gap-1 mb-2 text-yellow-800 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300">
                                <Star className="w-3 h-3" />
                                Popular
                              </Badge>
                            )}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {faq.question}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs capitalize">
                            {faq.category.replace('-', ' ')}
                          </Badge>
                          {expandedFaq === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedFaq === faq.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-6"
                          >
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                                {faq.answer}
                              </p>
                              <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Was this helpful? 
                                  <button className="ml-2 text-blue-600 dark:text-blue-400 hover:underline">
                                    Yes
                                  </button>
                                  <span className="mx-2">•</span>
                                  <button className="text-gray-500 dark:text-gray-400 hover:underline">
                                    No
                                  </button>
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredFaqs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  No results found
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Try adjusting your search terms or browse different categories.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  variant="outline"
                >
                  Clear filters
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto mt-20"
        >
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Still need help?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Our support team is here to assist you
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${method.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                        {method.title}
                      </h3>
                      <p className="mb-4 text-gray-600 dark:text-gray-400">
                        {method.description}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{method.responseTime}</span>
                      </div>
                      <Button className="w-full mt-6 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
                        Get Help
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-8 mt-16 text-center text-white rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <h3 className="mb-3 text-2xl font-bold">
            Can't find what you're looking for?
          </h3>
          <p className="max-w-2xl mx-auto mb-6 text-blue-100">
            Our dedicated support team is available 24/7 to help you with any questions or concerns about your career journey.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" className="rounded-xl">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Live Chat
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white rounded-xl hover:bg-white hover:text-blue-600">
              <Mail className="w-5 h-5 mr-2" />
              Email Support
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
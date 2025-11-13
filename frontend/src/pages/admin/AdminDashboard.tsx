import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/services/api';
import getSocket from '@/services/socket';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users,
  BookOpen,
  Trophy,
  Settings,
  TrendingUp,
  Edit3,
  Plus,
  Shield,
  Database,
  Mail,
  Server,
  Activity,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Award
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalQuestions: number;
  totalAttempts: number;
  activeCategories: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalQuestions: 0,
    totalAttempts: 0,
    activeCategories: 0
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);

      // users total (admin endpoint returns pagination.total)
      const usersRes = await api.get('/admin/users?page=1&limit=1');
      const usersTotal = usersRes.data?.data?.pagination?.total ?? 0;

      // questions total (admin endpoint returns pagination.total)
      const questionsRes = await api.get('/admin/questions?page=1&limit=1');
      const questionsTotal = questionsRes.data?.data?.pagination?.total ?? 0;

      // categories (public endpoint)
      const categoriesRes = await api.get('/categories');
      const categoriesList = categoriesRes.data?.data?.categories || [];
      const activeCategories = categoriesList.length;

      // Attempts: no admin endpoint available, leave as 0 for now
      const totalAttempts = 0;

      setStats({
        totalUsers: usersTotal,
        totalQuestions: questionsTotal,
        totalAttempts,
        activeCategories,
      });
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    const socket = getSocket();
    const refreshEvents = [
      'user:updated',
      'user:deleted',
      'question:created',
      'question:updated',
      'question:deleted',
      'category:created',
      'category:updated',
      'category:deleted',
    ];

    refreshEvents.forEach(event => socket.on(event, () => loadStats()));

    return () => {
      refreshEvents.forEach(event => socket.off(event));
    };
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Registered users',
      trend: '+12% this month'
    },
    {
      title: 'Questions',
      value: stats.totalQuestions,
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: 'Active questions',
      trend: '+5% this month'
    },
    {
      title: 'Quiz Attempts',
      value: stats.totalAttempts,
      icon: Trophy,
      color: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: 'Total attempts',
      trend: '+23% this month'
    },
    {
      title: 'Categories',
      value: stats.activeCategories,
      icon: Settings,
      color: 'from-orange-500 to-orange-600',
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: 'Active categories',
      trend: '+2 new this week'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Categories',
      description: 'Add, edit, or remove quiz categories',
      icon: BookOpen,
      href: '/admin/categories',
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500'
    },
    {
      title: 'Manage Questions',
      description: 'Create and edit quiz questions',
      icon: Edit3,
      href: '/admin/questions',
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-500'
    },
    {
      title: 'Career Info',
      description: 'Configure career recommendations and resources',
      icon: Award,
      href: '/admin/career-info',
      color: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-500'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-500'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-500'
    }
  ];

  const systemStatus = [
    { 
      service: 'API Server', 
      status: 'Operational', 
      icon: Server,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      description: 'All systems normal'
    },
    { 
      service: 'Database', 
      status: 'Operational', 
      icon: Database,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      description: 'Response time: 42ms'
    },
    { 
      service: 'File Storage', 
      status: 'Operational', 
      icon: Database,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      description: '85% storage available'
    },
    { 
      service: 'Email Service', 
      status: 'Maintenance', 
      icon: Mail,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      description: 'Scheduled maintenance'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-1/2 h-4 mb-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div className="w-3/4 h-8 bg-gray-200 rounded dark:bg-gray-700"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto space-y-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
              Dashboard Overview
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening with your platform today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Activity size={18} />
              Live Analytics
            </Button>
            <Button className="gap-2 border-0 bg-gradient-to-r from-blue-600 to-blue-700">
              <TrendingUp size={18} />
              Generate Report
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="transition-all duration-300 border-0 group hover:shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                            <Icon size={20} className={stat.iconColor} />
                          </div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {stat.title}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {stat.value.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {stat.description}
                          </p>
                        </div>
                        <p className="text-xs font-medium text-green-600 dark:text-green-400">
                          {stat.trend}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Quick Actions & Recent Activity */}
          <div className="space-y-8 lg:col-span-2">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Quick Actions
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Frequently used administrative tasks
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Plus size={16} />
                      Add New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <motion.a
                          key={action.title}
                          href={action.href}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="block p-4 transition-all duration-300 border border-gray-200 shadow-sm group rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 dark:border-gray-700 hover:border-transparent hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${action.iconBg} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <Icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                {action.title}
                              </h3>
                              <p className="text-sm text-gray-600 truncate dark:text-gray-400">
                                {action.description}
                              </p>
                            </div>
                            <ArrowRight size={16} className="text-gray-400 transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                          </div>
                        </motion.a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Activity
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Latest events and user actions
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        action: 'New user registered', 
                        time: '2 minutes ago',
                        user: 'john.doe@example.com',
                        icon: Users,
                        iconColor: 'text-green-500'
                      },
                      { 
                        action: 'Quiz completed in Programming', 
                        time: '5 minutes ago',
                        user: 'sarah.connor',
                        icon: Trophy,
                        iconColor: 'text-blue-500'
                      },
                      { 
                        action: 'New question added to AI category', 
                        time: '1 hour ago',
                        user: 'Admin User',
                        icon: BookOpen,
                        iconColor: 'text-purple-500'
                      },
                      { 
                        action: 'Career recommendation viewed', 
                        time: '2 hours ago',
                        user: 'mike.johnson',
                        icon: TrendingUp,
                        iconColor: 'text-orange-500'
                      }
                    ].map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div key={index} className="flex items-center gap-4 p-3 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${activity.iconColor}`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {activity.action}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              by {activity.user}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.time}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              <Clock size={12} className="inline mr-1" />
                              Recent
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* System Status & Notifications */}
          <div className="space-y-8">
            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    System Status
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    All services are operational
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemStatus.map((service, index) => {
                      const Icon = service.icon;
                      return (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                          <div className={`p-2 rounded-full ${service.bgColor}`}>
                            <Icon size={18} className={service.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {service.service}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {service.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center gap-1 text-sm font-medium ${service.color}`}>
                              {service.status === 'Operational' ? (
                                <CheckCircle size={14} />
                              ) : (
                                <AlertCircle size={14} />
                              )}
                              {service.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="border-0 border-l-4 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 text-white bg-blue-500 rounded-full">
                      <Shield size={20} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        Security Update Available
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        A new security patch is available for your system. Update now to ensure optimal protection.
                      </p>
                      <Button size="sm" className="bg-blue-600 border-0 hover:bg-blue-700">
                        Update Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
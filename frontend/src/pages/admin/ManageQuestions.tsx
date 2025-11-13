import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import getSocket from '@/services/socket';
import api from '@/services/api';
import { Question, Category } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Trash2, 
  Edit3, 
  Plus, 
  Search,
  Filter,
  BookOpen,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  MoreVertical,
  Save,
  X,
  Zap,
  Target,
  Star,
  Eye
} from 'lucide-react';

export const ManageQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState<'text' | 'difficulty' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [form, setForm] = useState({
    text: '',
    categoryId: '',
    difficulty: 'easy',
    options: ['', ''],
    correctIndex: 0
  });

  useEffect(() => {
    loadQuestions();
    loadCategories();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on('question:created', (question: Question) => {
      setQuestions(prev => [question, ...prev]);
    });
    socket.on('question:updated', (question: Question) => {
      setQuestions(prev => prev.map(q => (q._id === question._id ? question : q)));
    });
    socket.on('question:deleted', ({ id }: { id: string }) => {
      setQuestions(prev => prev.filter(q => q._id !== id));
    });

    return () => {
      socket.off('question:created');
      socket.off('question:updated');
      socket.off('question:deleted');
    };
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/questions?page=1&limit=50');
      const data = res.data?.data;
      // Mock additional data for demo
      const mockQuestions = (data?.questions || []).map((q: Question, index: number) => ({
        ...q,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        usageCount: Math.floor(Math.random() * 100),
      }));
      setQuestions(mockQuestions);
    } catch (err) {
      console.error('Failed to load questions', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      const data = res.data?.data;
      setCategories(data?.categories || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ 
      text: '', 
      categoryId: categories[0]?._id || '', 
      difficulty: 'easy', 
      options: ['', ''], 
      correctIndex: 0 
    });
    setShowForm(true);
  };

  const openEdit = (q: Question) => {
    setEditing(q);
    setForm({
      text: q.text,
      categoryId: typeof q.categoryId === 'string' ? q.categoryId : (q as any).categoryId?._id || '',
      difficulty: q.difficulty,
      options: [...q.options],
      correctIndex: (q as any).correctIndex ?? 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) return;
    try {
      setDeletingIds(prev => [...prev, id]);
      await api.delete(`/admin/questions/${id}`);
      setQuestions(prev => prev.filter(q => q._id !== id));
      setDeletingIds(prev => prev.filter(i => i !== id));
    } catch (err) {
      console.error('Failed to delete question', err);
      const e: any = err;
      const msg = e?.response?.data?.message || e?.message || 'Failed to delete question';
      alert(msg);
      setDeletingIds(prev => prev.filter(i => i !== id));
    }
  };

  const updateOption = (index: number, value: string) => {
    setForm(prev => {
      const opts = [...prev.options];
      opts[index] = value;
      return { ...prev, options: opts };
    });
  };

  const addOption = () => {
    // Backend allows a maximum of 5 options. Prevent adding a 6th option here.
    if (form.options.length < 5) {
      setForm(prev => ({ ...prev, options: [...prev.options, ''] }));
    }
  };

  const removeOption = (index: number) => {
    if (form.options.length > 2) {
      setForm(prev => {
        const opts = prev.options.filter((_, i) => i !== index);
        const correctIndex = prev.correctIndex >= opts.length ? opts.length - 1 : prev.correctIndex;
        return { ...prev, options: opts, correctIndex };
      });
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.text.trim() || !form.categoryId) {
      alert('Please provide question text and category.');
      return;
    }
    if (form.options.length < 2 || form.options.some(opt => !opt.trim())) {
      alert('Please provide at least 2 valid options.');
      return;
    }
    if (form.options.length > 5) {
      alert('Questions may have at most 5 options. Please remove extra options.');
      return;
    }

    const payload = {
      text: form.text,
      categoryId: form.categoryId,
      difficulty: form.difficulty,
      options: form.options,
      correctIndex: form.correctIndex
    };

    try {
      if (editing) {
        const res = await api.put(`/admin/questions/${editing._id}`, payload);
        const updated = res.data?.data?.question;
        setQuestions(prev => prev.map(q => q._id === updated._id ? updated : q));
      } else {
        const res = await api.post('/admin/questions', payload);
        const created = res.data?.data?.question;
        setQuestions(prev => [created, ...prev]);
      }
      setShowForm(false);
    } catch (err: any) {
      console.error('Failed to save question', err);
      alert(err?.response?.data?.message || 'Save failed');
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const variants = {
      easy: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle },
      medium: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Target },
      hard: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: Zap },
    };
    const { color, icon: Icon } = variants[difficulty as keyof typeof variants] || variants.easy;
    
    return (
      <Badge className={`${color} gap-1 px-2 py-1 text-xs`}>
        <Icon size={12} />
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Badge>
    );
  };

  const filteredQuestions = questions
    .filter(question => {
      const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || 
                             (typeof question.categoryId === 'string' 
                               ? question.categoryId === selectedCategory
                               : (question as any).categoryId?._id === selectedCategory);
      const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aValue = new Date(a.createdAt || '').getTime();
        bValue = new Date(b.createdAt || '').getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });

  // Group filtered questions by category id -> { name, questions[] }
  const groupedByCategory: Record<string, { name: string; questions: Question[] }> = filteredQuestions.reduce((acc, q) => {
    const catId = typeof q.categoryId === 'string' ? q.categoryId : (q as any).categoryId?._id || 'uncategorized';
    const catName = categories.find(c => c._id === catId)?.name || 'Uncategorized';
    if (!acc[catId]) acc[catId] = { name: catName, questions: [] };
    acc[catId].questions.push(q);
    return acc;
  }, {} as Record<string, { name: string; questions: Question[] }>);

  // Build an ordered list of category ids to render:
  // 1) categories that exist in `categories` and have questions
  // 2) then any remaining category ids that are present only in groupedByCategory (e.g. missing from categories list)
  const categoryOrder = [
    ...categories.map(c => c._id).filter(id => Boolean(groupedByCategory[id])),
    ...Object.keys(groupedByCategory).filter(id => !categories.some(c => c._id === id))
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded dark:bg-gray-700"></div>
                      <div className="w-1/2 h-3 bg-gray-200 rounded dark:bg-gray-700"></div>
                    </div>
                    <div className="w-20 h-8 bg-gray-200 rounded dark:bg-gray-700"></div>
                  </div>
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
      <div className="mx-auto space-y-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
              Question Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create, edit, and organize quiz questions across all categories
            </p>
          </div>
          <Button 
            onClick={openCreate}
            className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-xl"
          >
            <Plus className="mr-2" size={18} />
            New Question
          </Button>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Questions', value: questions.length, color: 'from-blue-500 to-blue-600', icon: BookOpen },
            { label: 'Easy Questions', value: questions.filter(q => q.difficulty === 'easy').length, color: 'from-green-500 to-green-600', icon: CheckCircle },
            { label: 'Medium Questions', value: questions.filter(q => q.difficulty === 'medium').length, color: 'from-yellow-500 to-yellow-600', icon: Target },
            { label: 'Hard Questions', value: questions.filter(q => q.difficulty === 'hard').length, color: 'from-red-500 to-red-600', icon: Zap },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
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
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                        <Icon size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1 w-full lg:max-w-md">
                  <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
                  <Input
                    placeholder="Search questions or options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>
                
                <div className="flex flex-wrap w-full gap-3 lg:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>

                  <Button variant="outline" className="gap-2">
                    <Filter size={16} />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Question Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {editing ? 'Edit Question' : 'Create New Question'}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowForm(false)}
                    >
                      <X size={20} />
                    </Button>
                  </div>

                  <form onSubmit={submitForm} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Category *
                        </label>
                        <select 
                          value={form.categoryId} 
                          onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
                          className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Difficulty *
                        </label>
                        <select 
                          value={form.difficulty} 
                          onChange={e => setForm(prev => ({ ...prev, difficulty: e.target.value }))}
                          className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Question Text *
                      </label>
                      <textarea 
                        value={form.text} 
                        onChange={e => setForm(prev => ({ ...prev, text: e.target.value }))}
                        className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg resize-none dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter your question here..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Options * (Select the correct answer)
                      </label>
                      <div className="space-y-3">
                        {form.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <button 
                              type="button" 
                              onClick={() => setForm(prev => ({ ...prev, correctIndex: i }))}
                              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-all ${
                                form.correctIndex === i 
                                  ? 'bg-green-500 text-white shadow-lg scale-105' 
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {String.fromCharCode(65 + i)}
                            </button>
                            <input 
                              value={opt} 
                              onChange={e => updateOption(i, e.target.value)}
                              className="flex-1 px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder={`Option ${String.fromCharCode(65 + i)}...`}
                              required
                            />
                            {form.options.length > 2 && (
                              <button 
                                type="button" 
                                onClick={() => removeOption(i)}
                                className="flex-shrink-0 p-2 text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <XCircle size={20} />
                              </button>
                            )}
                          </div>
                        ))}
                        
                        {form.options.length < 6 && (
                          <Button 
                            type="button" 
                            onClick={addOption}
                            variant="outline"
                            className="mt-2"
                          >
                            <Plus size={16} className="mr-2" />
                            Add Option
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="submit"
                        className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-xl"
                      >
                        <Save className="mr-2" size={16} />
                        {editing ? 'Update Question' : 'Create Question'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Questions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-6 text-sm font-medium text-gray-600 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                <div className="col-span-6">Question</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-1">Options</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Questions List grouped by Category */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {/* Render categories in order; include uncategorized at the end */}
                  {[...categoryOrder, ...(groupedByCategory['uncategorized'] && !categoryOrder.includes('uncategorized') ? ['uncategorized'] : [])].map((catId, catIndex) => {
                    const group = groupedByCategory[catId];
                    if (!group || group.questions.length === 0) return null;

                    return (
                      <div key={catId} className="pb-4">
                        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                          <div className="font-medium text-gray-800 dark:text-white">
                            {group.name}
                            <span className="ml-2 text-sm text-gray-500">({group.questions.length})</span>
                          </div>
                          <div className="text-sm text-gray-500">Category</div>
                        </div>

                        {group.questions.map((question, qIndex) => (
                          <motion.div
                            key={question._id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ delay: (catIndex * 0.05) + (qIndex * 0.02) }}
                            className="grid items-center grid-cols-12 gap-4 p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <div className="col-span-6">
                              <div className="mb-2 font-semibold text-gray-900 dark:text-white line-clamp-2">
                                {question.text}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {question.options.slice(0, 3).map((opt, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {String.fromCharCode(65 + i)}: {opt}
                                  </Badge>
                                ))}
                                {question.options.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{question.options.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="col-span-2">
                              <span className="text-gray-700 dark:text-gray-300">
                                {group.name}
                              </span>
                            </div>

                            <div className="col-span-2">
                              {getDifficultyBadge(question.difficulty)}
                            </div>

                            <div className="col-span-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {question.options.length}
                              </span>
                            </div>

                            <div className="col-span-1">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEdit(question)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  <Edit3 size={16} />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(question._id)}
                                  loading={deletingIds.includes(question._id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Empty State */}
              {filteredQuestions.length === 0 && (
                <div className="py-12 text-center">
                  <div className="mb-4 text-gray-400 dark:text-gray-500">
                    <BookOpen size={48} className="mx-auto" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    No questions found
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Get started by creating your first question'
                    }
                  </p>
                  {!searchTerm && selectedCategory === 'all' && selectedDifficulty === 'all' && (
                    <Button onClick={openCreate}>
                      <Plus className="mr-2" size={16} />
                      Create First Question
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ManageQuestions;
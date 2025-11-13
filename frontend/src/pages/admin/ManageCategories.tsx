import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoryService } from '@/services/api';
import api from '@/services/api';
import getSocket from '@/services/socket';
import { Category, Question } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  BookOpen,
  FolderOpen,
  TrendingUp,
  BarChart3,
  Users,
  Target,
  Save,
  X,
  CheckCircle,
  XCircle,
  MoreVertical,
  Download,
  Upload
} from 'lucide-react';

export const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionCounts, setQuestionCounts] = useState<Record<string, { questionCount: number; usageCount: number; activeUsers: number }>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6' // Default blue color
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      // Use real data from the API (do not mock)
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestionsForStats = async () => {
    try {
      // load a large page so we can compute counts for categories
      const res = await api.get('/admin/questions?page=1&limit=1000');
      const data = res.data?.data;
      const qs: Question[] = data?.questions || [];
      setQuestions(qs);

      const counts: Record<string, { questionCount: number; usageCount: number; activeUsers: number }> = {};
      qs.forEach((q) => {
        const catId = typeof q.categoryId === 'string' ? q.categoryId : (q as any).categoryId?._id || 'uncategorized';
        if (!counts[catId]) counts[catId] = { questionCount: 0, usageCount: 0, activeUsers: 0 };
        counts[catId].questionCount += 1;
        // usageCount and activeUsers may not be available on questions; try to read if present
        counts[catId].usageCount += (q as any).usageCount || 0;
        counts[catId].activeUsers += (q as any).activeUsers || 0;
      });

      setQuestionCounts(counts);
    } catch (err) {
      console.error('Error loading questions for stats:', err);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    socket.on('category:created', (category: Category) => {
      setCategories(prev => [category, ...prev]);
    });
    socket.on('category:updated', (category: Category) => {
      setCategories(prev => prev.map(c => (c._id === category._id ? category : c)));
    });
    socket.on('category:deleted', ({ id }: { id: string }) => {
      setCategories(prev => prev.filter(c => c._id !== id));
    });

    return () => {
      socket.off('category:created');
      socket.off('category:updated');
      socket.off('category:deleted');
    };
  }, []);

  // Load questions to compute per-category stats
  useEffect(() => {
    loadQuestionsForStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Client-side validation to avoid server 400s
      const name = (formData.name || '').trim();
      const description = (formData.description || '').trim();

      if (name.length < 2 || name.length > 50) {
        alert('Category name must be between 2 and 50 characters');
        return;
      }
      if (description.length < 10 || description.length > 500) {
        alert('Description must be between 10 and 500 characters');
        return;
      }

      if (editingCategory) {
        await categoryService.update(editingCategory._id, formData);
      } else {
        await categoryService.create(formData);
      }

      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      // Show server validation errors if present
      const err: any = error;
      const resp = err?.response?.data;
      if (resp) {
        if (resp.errors && Array.isArray(resp.errors)) {
          const msgs = resp.errors.map((e: any) => e.msg).join('\n');
          alert(`Validation error:\n${msgs}`);
          return;
        }
        if (resp.message) {
          alert(resp.message);
          return;
        }
      }
      alert('Error saving category. See console for details.');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: (category as any).color || '#3B82F6'
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category? All associated questions will also be deleted.')) {
      return;
    }
    
    try {
      await categoryService.delete(categoryId);
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const toggleCategoryStatus = async (category: Category) => {
    try {
      await categoryService.update(category._id, { active: !category.active });
      loadCategories();
    } catch (error) {
      console.error('Error updating category status:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#3B82F6' });
    setEditingCategory(null);
    setShowForm(false);
  };

  const colorOptions = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4',
    '#84CC16', '#F97316', '#6366F1', '#EC4899', '#14B8A6', '#78716C'
  ];

  const getCategoryStats = () => {
    // Prefer computed counts (from questions) when available, otherwise fallback to category fields
    const totalQuestions = categories.reduce((sum, cat) => {
      return sum + (questionCounts[cat._id]?.questionCount ?? ((cat as any).questionCount || 0));
    }, 0);

    const totalUsage = categories.reduce((sum, cat) => {
      return sum + (questionCounts[cat._id]?.usageCount ?? ((cat as any).usageCount || 0));
    }, 0);

    const activeCategories = categories.filter(cat => cat.active).length;
    
    return { totalQuestions, totalUsage, activeCategories };
  };

  const stats = getCategoryStats();

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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-3/4 h-4 mb-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div className="w-full h-3 mb-2 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div className="w-5/6 h-3 bg-gray-200 rounded dark:bg-gray-700"></div>
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
          className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text">
              Category Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Organize and manage quiz categories for better content organization
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download size={18} />
              Export
            </Button>
            <Button 
              onClick={() => setShowForm(true)}
              className="gap-2 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700"
            >
              <Plus size={18} />
              New Category
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              label: 'Total Categories', 
              value: categories.length, 
              color: 'from-blue-500 to-blue-600', 
              icon: FolderOpen,
              change: '+2 this month'
            },
            { 
              label: 'Active Categories', 
              value: stats.activeCategories, 
              color: 'from-green-500 to-green-600', 
              icon: CheckCircle,
              change: 'All systems operational'
            },
            { 
              label: 'Total Questions', 
              value: stats.totalQuestions, 
              color: 'from-purple-500 to-purple-600', 
              icon: BookOpen,
              change: '+15% from last month'
            },
            { 
              label: 'Total Usage', 
              value: stats.totalUsage.toLocaleString(), 
              color: 'from-orange-500 to-orange-600', 
              icon: TrendingUp,
              change: 'Popular categories growing'
            }
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
                        <p className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">
                          {stat.change}
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

        {/* Search and Actions */}
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
                    placeholder="Search categories by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>
                
                <div className="flex flex-wrap w-full gap-3 lg:w-auto">
                  
                  <Button variant="outline" className="gap-2">
                    <Filter size={16} />
                    More Filters
                  </Button>

                  <Button variant="outline" className="gap-2">
                    <Upload size={16} />
                    Import
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Form */}
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
                      {editingCategory ? 'Edit Category' : 'Create New Category'}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetForm}
                    >
                      <X size={20} />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Category Name *
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter category name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Category Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, color }))}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                formData.color === color 
                                  ? 'border-gray-900 dark:border-white scale-110' 
                                  : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="block w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg resize-none dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe what this category is about..."
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="submit"
                        className="gap-2 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-xl"
                      >
                        <Save size={16} />
                        {editingCategory ? 'Update Category' : 'Create Category'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={resetForm}
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

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filteredCategories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center col-span-full"
              >
                <div className="mb-4 text-gray-400 dark:text-gray-500">
                  <FolderOpen size={64} className="mx-auto" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  No Categories Found
                </h3>
                <p className="max-w-md mx-auto mb-6 text-gray-600 dark:text-gray-400">
                  {searchTerm 
                    ? 'No categories match your search criteria. Try adjusting your search terms.'
                    : 'Get started by creating your first category to organize your quiz questions.'
                  }
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700"
                  >
                    <Plus className="mr-2" size={16} />
                    Create Your First Category
                  </Button>
                )}
              </motion.div>
            ) : (
              filteredCategories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="transition-all duration-300 border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl group">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="flex items-center justify-center w-12 h-12 font-bold text-white shadow-lg rounded-xl"
                            style={{ backgroundColor: (category as any).color || '#3B82F6' }}
                          >
                            {category.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 transition-colors dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {category.name}
                            </h3>
                              
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            <Edit3 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {category.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {questionCounts[category._id]?.questionCount ?? ((category as any).questionCount || 0)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Questions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {(questionCounts[category._id]?.usageCount ?? ((category as any).usageCount || 0)).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Usage</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {questionCounts[category._id]?.activeUsers ?? ((category as any).activeUsers || 0)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Users</div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Created {new Date(category.createdAt).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategoryStatus(category)}
                          className={`text-xs ${
                            category.active 
                              ? 'text-red-600 hover:text-red-700' 
                              : 'text-green-600 hover:text-green-700'
                          }`}
                        >
                          {category.active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
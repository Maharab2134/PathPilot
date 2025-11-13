import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { careerService, categoryService } from '@/services/api';
import getSocket from '@/services/socket';
import { CareerInfo, Category } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Youtube,
  BookOpen,
  Award,
  X,
  Search,
  Filter,
  GraduationCap,
  Target,
  BookMarked,
  Video,
  ChevronDown,
  ChevronUp,
  Users,
  TrendingUp,
  Clock,
  ExternalLink,
  Save,
  Download,
  Upload,
  Zap,
  Star,
  Lightbulb
} from 'lucide-react';

export const ManageCareerInfo: React.FC = () => {
  const [careerInfos, setCareerInfos] = useState<CareerInfo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState<CareerInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    skills: true,
    learningPath: true,
    resources: true
  });

  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    minScore: 70,
    skills: [] as string[],
    learningPath: [] as string[],
    youtubeLinks: [] as string[],
    bookLinks: [] as string[],
    courseLinks: [] as string[]
  });
  const [newSkill, setNewSkill] = useState('');
  const [newLearningStep, setNewLearningStep] = useState('');
  const [newYoutubeLink, setNewYoutubeLink] = useState('');
  const [newBookLink, setNewBookLink] = useState('');
  const [newCourseLink, setNewCourseLink] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);

      // Fetch career info for all categories in parallel. Use allSettled to skip missing entries.
      const promises = categoriesData.map(cat => careerService.getByCategory(cat._id));
      const results = await Promise.allSettled(promises);
      const careerInfosData: CareerInfo[] = results
        .filter(r => r.status === 'fulfilled')
        .map((r: any) => r.value as CareerInfo);
      setCareerInfos(careerInfosData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    socket.on('career:created', () => loadData());
    socket.on('career:updated', () => loadData());
    socket.on('career:deleted', () => loadData());

    return () => {
      socket.off('career:created');
      socket.off('career:updated');
      socket.off('career:deleted');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCareer) {
        await careerService.update(editingCareer._id, formData);
      } else {
        await careerService.create(formData);
      }
      
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving career info:', error);
    }
  };

  const handleEdit = (careerInfo: CareerInfo) => {
    setEditingCareer(careerInfo);
    setFormData({
      categoryId: typeof careerInfo.categoryId === 'string' ? careerInfo.categoryId : careerInfo.categoryId._id,
      title: careerInfo.title,
      description: careerInfo.description,
      minScore: careerInfo.minScore,
      skills: [...careerInfo.skills],
      learningPath: [...careerInfo.learningPath],
      youtubeLinks: [...careerInfo.youtubeLinks],
      bookLinks: [...careerInfo.bookLinks],
      courseLinks: [...careerInfo.courseLinks]
    });
    setShowForm(true);
  };

  const handleDelete = async (careerInfoId: string) => {
    if (!window.confirm('Are you sure you want to delete this career information? This action cannot be undone.')) {
      return;
    }
    
    try {
      await careerService.delete(careerInfoId);
      loadData();
    } catch (error) {
      console.error('Error deleting career info:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      title: '',
      description: '',
      minScore: 70,
      skills: [],
      learningPath: [],
      youtubeLinks: [],
      bookLinks: [],
      courseLinks: []
    });
    setNewSkill('');
    setNewLearningStep('');
    setNewYoutubeLink('');
    setNewBookLink('');
    setNewCourseLink('');
    setEditingCareer(null);
    setShowForm(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addLearningStep = () => {
    if (newLearningStep.trim() && !formData.learningPath.includes(newLearningStep.trim())) {
      setFormData(prev => ({
        ...prev,
        learningPath: [...prev.learningPath, newLearningStep.trim()]
      }));
      setNewLearningStep('');
    }
  };

  const removeLearningStep = (step: string) => {
    setFormData(prev => ({
      ...prev,
      learningPath: prev.learningPath.filter(s => s !== step)
    }));
  };

  const addYoutubeLink = () => {
    if (newYoutubeLink.trim() && !formData.youtubeLinks.includes(newYoutubeLink.trim())) {
      setFormData(prev => ({
        ...prev,
        youtubeLinks: [...prev.youtubeLinks, newYoutubeLink.trim()]
      }));
      setNewYoutubeLink('');
    }
  };

  const removeYoutubeLink = (link: string) => {
    setFormData(prev => ({
      ...prev,
      youtubeLinks: prev.youtubeLinks.filter(l => l !== link)
    }));
  };

  const addBookLink = () => {
    if (newBookLink.trim() && !formData.bookLinks.includes(newBookLink.trim())) {
      setFormData(prev => ({
        ...prev,
        bookLinks: [...prev.bookLinks, newBookLink.trim()]
      }));
      setNewBookLink('');
    }
  };

  const removeBookLink = (link: string) => {
    setFormData(prev => ({
      ...prev,
      bookLinks: prev.bookLinks.filter(l => l !== link)
    }));
  };

  const addCourseLink = () => {
    if (newCourseLink.trim() && !formData.courseLinks.includes(newCourseLink.trim())) {
      setFormData(prev => ({
        ...prev,
        courseLinks: [...prev.courseLinks, newCourseLink.trim()]
      }));
      setNewCourseLink('');
    }
  };

  const removeCourseLink = (link: string) => {
    setFormData(prev => ({
      ...prev,
      courseLinks: prev.courseLinks.filter(l => l !== link)
    }));
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c._id === categoryId)?.name || 'Unknown Category';
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter career infos
  const filteredCareerInfos = careerInfos.filter(careerInfo => {
    const matchesSearch = careerInfo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         careerInfo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (typeof careerInfo.categoryId === 'string' ? 
                            careerInfo.categoryId === selectedCategory : 
                            careerInfo.categoryId._id === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const getCareerStats = () => {
    const totalSkills = careerInfos.reduce((sum, career) => sum + career.skills.length, 0);
    const totalResources = careerInfos.reduce((sum, career) => 
      sum + career.youtubeLinks.length + career.bookLinks.length + career.courseLinks.length, 0);
    const avgLearningSteps = careerInfos.length > 0 
      ? Math.round(careerInfos.reduce((sum, career) => sum + career.learningPath.length, 0) / careerInfos.length)
      : 0;

    return { totalSkills, totalResources, avgLearningSteps };
  };

  const stats = getCareerStats();

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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
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
              Career Path Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Design and manage career recommendations with comprehensive learning resources
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
              New Career Path
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              label: 'Career Paths', 
              value: careerInfos.length, 
              color: 'from-blue-500 to-blue-600', 
              icon: GraduationCap,
              change: '+2 this month'
            },
            { 
              label: 'Total Skills', 
              value: stats.totalSkills, 
              color: 'from-green-500 to-green-600', 
              icon: Zap,
              change: 'Across all careers'
            },
            { 
              label: 'Learning Resources', 
              value: stats.totalResources, 
              color: 'from-purple-500 to-purple-600', 
              icon: BookOpen,
              change: 'Videos, books & courses'
            },
            { 
              label: 'Avg. Learning Steps', 
              value: stats.avgLearningSteps, 
              color: 'from-orange-500 to-orange-600', 
              icon: Target,
              change: 'Per career path'
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

        {/* Search and Filters */}
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
                    placeholder="Search career paths by title or description..."
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

        {/* Career Form */}
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
                      {editingCareer ? 'Edit Career Path' : 'Create New Career Path'}
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
                          Category *
                        </label>
                        <select
                          value={formData.categoryId}
                          onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                          className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          disabled={!!editingCareer}
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Minimum Score (%) *
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.minScore}
                          onChange={(e) => setFormData(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Career Title *
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Software Developer, Data Scientist, UX Designer"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Career Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="block w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg resize-none dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe this career path, responsibilities, growth opportunities, and typical work environment..."
                        required
                      />
                    </div>

                    {/* Collapsible Sections */}
                    <div className="space-y-4">
                      {/* Skills Section */}
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-0">
                          <button
                            type="button"
                            onClick={() => toggleSection('skills')}
                            className="flex items-center justify-between w-full p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 text-blue-600 bg-blue-100 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                                <Zap size={20} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  Required Skills
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {formData.skills.length} skills added
                                </p>
                              </div>
                            </div>
                            {expandedSections.skills ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                          <AnimatePresence>
                            {expandedSections.skills && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-4 pb-4"
                              >
                                <div className="flex gap-2 mb-4">
                                  <Input
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Add a skill (e.g., JavaScript, Python, Communication)"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                  />
                                  <Button type="button" onClick={addSkill} className="whitespace-nowrap">
                                    Add Skill
                                  </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {formData.skills.map((skill, index) => (
                                    <Badge key={index} variant="outline" className="gap-2 py-1.5">
                                      {skill}
                                      <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className="transition-colors hover:text-red-600"
                                      >
                                        <X size={14} />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>

                      {/* Learning Path Section */}
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-0">
                          <button
                            type="button"
                            onClick={() => toggleSection('learningPath')}
                            className="flex items-center justify-between w-full p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 text-green-600 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-400">
                                <Target size={20} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  Learning Path
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {formData.learningPath.length} steps defined
                                </p>
                              </div>
                            </div>
                            {expandedSections.learningPath ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                          <AnimatePresence>
                            {expandedSections.learningPath && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-4 pb-4"
                              >
                                <div className="flex gap-2 mb-4">
                                  <Input
                                    value={newLearningStep}
                                    onChange={(e) => setNewLearningStep(e.target.value)}
                                    placeholder="Add a learning step (e.g., Learn basic programming concepts)"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLearningStep())}
                                  />
                                  <Button type="button" onClick={addLearningStep} className="whitespace-nowrap">
                                    Add Step
                                  </Button>
                                </div>
                                <ol className="space-y-3">
                                  {formData.learningPath.map((step, index) => (
                                    <li key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                      <div className="flex items-center space-x-3">
                                        <span className="flex items-center justify-center w-6 h-6 text-sm font-medium text-white bg-blue-600 rounded-full">
                                          {index + 1}
                                        </span>
                                        <span className="text-gray-700 dark:text-gray-300">{step}</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeLearningStep(step)}
                                        className="text-red-500 transition-colors hover:text-red-700"
                                      >
                                        <X size={16} />
                                      </button>
                                    </li>
                                  ))}
                                </ol>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>

                      {/* Resources Section */}
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-0">
                          <button
                            type="button"
                            onClick={() => toggleSection('resources')}
                            className="flex items-center justify-between w-full p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 text-purple-600 bg-purple-100 rounded-lg dark:bg-purple-900/30 dark:text-purple-400">
                                <BookOpen size={20} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  Learning Resources
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Videos, books, and courses
                                </p>
                              </div>
                            </div>
                            {expandedSections.resources ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                          <AnimatePresence>
                            {expandedSections.resources && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-4 pb-4 space-y-6"
                              >
                                {/* YouTube Links */}
                                <div className="space-y-3">
                                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Youtube className="text-red-500" size={18} />
                                    YouTube Tutorials
                                  </label>
                                  <div className="flex gap-2">
                                    <Input
                                      value={newYoutubeLink}
                                      onChange={(e) => setNewYoutubeLink(e.target.value)}
                                      placeholder="https://www.youtube.com/watch?v=..."
                                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addYoutubeLink())}
                                    />
                                    <Button type="button" onClick={addYoutubeLink}>
                                      Add
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    {formData.youtubeLinks.map((link, index) => (
                                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <span className="flex-1 text-sm text-gray-600 dark:text-gray-400">{link}</span>
                                        <button
                                          type="button"
                                          onClick={() => removeYoutubeLink(link)}
                                          className="text-red-500 transition-colors hover:text-red-700"
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Book Links */}
                                <div className="space-y-3">
                                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <BookMarked className="text-blue-500" size={18} />
                                    Recommended Books
                                  </label>
                                  <div className="flex gap-2">
                                    <Input
                                      value={newBookLink}
                                      onChange={(e) => setNewBookLink(e.target.value)}
                                      placeholder="https://example.com/book-resource"
                                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBookLink())}
                                    />
                                    <Button type="button" onClick={addBookLink}>
                                      Add
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    {formData.bookLinks.map((link, index) => (
                                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <span className="flex-1 text-sm text-gray-600 dark:text-gray-400">{link}</span>
                                        <button
                                          type="button"
                                          onClick={() => removeBookLink(link)}
                                          className="text-red-500 transition-colors hover:text-red-700"
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Course Links */}
                                <div className="space-y-3">
                                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Award className="text-green-500" size={18} />
                                    Online Courses
                                  </label>
                                  <div className="flex gap-2">
                                    <Input
                                      value={newCourseLink}
                                      onChange={(e) => setNewCourseLink(e.target.value)}
                                      placeholder="https://example.com/course-link"
                                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCourseLink())}
                                    />
                                    <Button type="button" onClick={addCourseLink}>
                                      Add
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    {formData.courseLinks.map((link, index) => (
                                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                        <span className="flex-1 text-sm text-gray-600 dark:text-gray-400">{link}</span>
                                        <button
                                          type="button"
                                          onClick={() => removeCourseLink(link)}
                                          className="text-red-500 transition-colors hover:text-red-700"
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="submit"
                        className="gap-2 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-xl"
                      >
                        <Save size={16} />
                        {editingCareer ? 'Update Career Path' : 'Create Career Path'}
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

        {/* Career Paths Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Career Paths
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredCareerInfos.length} career paths found
              </p>
            </div>
          </div>

          {filteredCareerInfos.length === 0 ? (
            <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <div className="mb-4 text-gray-400 dark:text-gray-500">
                  <GraduationCap size={64} className="mx-auto" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {careerInfos.length === 0 ? 'No Career Paths Created' : 'No Matching Career Paths'}
                </h3>
                <p className="max-w-md mx-auto mb-6 text-gray-600 dark:text-gray-400">
                  {careerInfos.length === 0 
                    ? 'Get started by creating career paths to guide users toward their professional goals.'
                    : 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                  }
                </p>
                {!searchTerm && selectedCategory === 'all' && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700"
                  >
                    <Plus className="mr-2" size={16} />
                    Create Your First Career Path
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <AnimatePresence>
                {filteredCareerInfos.map((careerInfo, index) => (
                  <motion.div
                    key={careerInfo._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="h-full transition-all duration-300 border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl group">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-blue-600">
                                <GraduationCap size={20} />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 transition-colors dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                  {careerInfo.title}
                                </h3>
                                <Badge variant="outline" className="mt-1">
                                  {getCategoryName(typeof careerInfo.categoryId === 'string' ? careerInfo.categoryId : careerInfo.categoryId._id)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(careerInfo)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Edit3 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(careerInfo._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {careerInfo.description}
                        </p>
                        
                        <div className="pt-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Target size={16} />
                              <span>Min. Score: <strong>{careerInfo.minScore}%</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Zap size={16} />
                              <span><strong>{careerInfo.skills.length}</strong> skills</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Video size={14} />
                                <span>{careerInfo.youtubeLinks.length}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookMarked size={14} />
                                <span>{careerInfo.bookLinks.length}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Award size={14} />
                                <span>{careerInfo.courseLinks.length}</span>
                              </div>
                            </div>
                            <Badge className="text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                              {careerInfo.learningPath.length} learning steps
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
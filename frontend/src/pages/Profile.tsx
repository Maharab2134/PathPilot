import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  User, 
  Camera, 
  Save, 
  Edit3, 
  Award,
  TrendingUp,
  Target,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  X,
  Upload,
  Star,
  BookOpen,
  Zap
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: (user as any)?.bio || 'Passionate learner and quiz enthusiast'
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
  const BACKEND_ORIGIN = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:5000').replace(/\/?api\/?$/, '');
  const displayAvatar = avatarPreview
    ? avatarPreview.startsWith('http')
      ? avatarPreview
      : avatarPreview.startsWith('/')
      ? `${BACKEND_ORIGIN}${avatarPreview}`
      : avatarPreview
    : '';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      setAvatar(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // API expects name and avatar; bio isn't part of the update payload on the server
      const updatedUser = await authService.updateProfile({
        name: formData.name,
        avatar: avatar || undefined
      });
      updateProfile(updatedUser);
      setIsEditing(false);
      setAvatar(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: (user as any)?.bio || 'Passionate learner and quiz enthusiast'
    });
    setAvatar(null);
    setAvatarPreview(user?.avatarUrl || '');
    setIsEditing(false);
  };

  const stats = [
    { icon: BookOpen, label: 'Quizzes Taken', value: 12, color: 'from-blue-500 to-blue-600', change: '+2 this week' },
    { icon: Award, label: 'Average Score', value: '85%', color: 'from-green-500 to-green-600', change: '+5% from last month' },
    { icon: Target, label: 'Career Paths', value: 3, color: 'from-purple-500 to-purple-600', change: 'AI Engineer suggested' },
    { icon: TrendingUp, label: 'Learning Streak', value: '7 days', color: 'from-orange-500 to-orange-600', change: 'Keep going!' }
  ];

  const achievements = [
    { name: 'Quick Learner', icon: Zap, description: 'Completed 5 quizzes in one day', earned: true },
    { name: 'Perfectionist', icon: Star, description: 'Scored 100% on any quiz', earned: false },
    { name: 'Dedicated', icon: Target, description: '7-day learning streak', earned: true },
    { name: 'Explorer', icon: Award, description: 'Tried all categories', earned: false }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text">
            Profile Settings
          </h1>
          <p className="max-w-2xl mx-auto mt-3 text-lg text-gray-600 dark:text-gray-400">
            Manage your account information, track your progress, and showcase your achievements
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Card & Stats */}
          <div className="space-y-6 lg:col-span-1">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    {/* Avatar */}
                    <div className="relative inline-block mb-4">
                      <div className="relative">
                        <div className="flex items-center justify-center w-32 h-32 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                          <AnimatePresence mode="wait">
                            {displayAvatar ? (
                              <motion.img
                                key="avatar"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={displayAvatar}
                                alt="Profile"
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <motion.div
                                key="placeholder"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"
                              >
                                <User size={48} className="text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {isEditing && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute p-3 text-white transition-all shadow-lg -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-xl"
                          >
                            <Camera size={18} />
                          </motion.button>
                        )}
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>

                    {/* User Info */}
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formData.name}
                      </h2>
                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                        <Mail size={16} />
                        <span>{user.email}</span>
                      </div>
                      <Badge className="text-white border-0 bg-gradient-to-r from-green-500 to-green-600">
                        <Shield size={14} className="mr-1" />
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </div>

                    {/* Bio */}
                    {isEditing ? (
                      <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium text-left text-gray-700 dark:text-gray-300">
                          Bio
                        </label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg resize-none dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          maxLength={150}
                          placeholder="Tell us about yourself..."
                        />
                        <div className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
                          {formData.bio.length}/150
                        </div>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {formData.bio}
                      </p>
                    )}

                    {/* Member Since */}
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={14} />
                      <span>
                        Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -2 }}
                    className="p-4 border border-gray-200 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white shadow-md`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">
                      {stat.change}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column - Edit Form & Achievements */}
          <div className="space-y-8 lg:col-span-2">
            {/* Edit Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Personal Information
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Update your profile details and preferences
                      </p>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {!isEditing ? (
                        <motion.div
                          key="edit-button"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                        >
                          <Button
                            onClick={() => setIsEditing(true)}
                            className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl"
                          >
                            <Edit3 className="mr-2" size={16} />
                            Edit Profile
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="action-buttons"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex gap-3"
                        >
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                          >
                            <X className="mr-2" size={16} />
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSave}
                            loading={loading}
                            disabled={!formData.name.trim()}
                            className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-green-700 hover:shadow-xl"
                          >
                            <Save className="mr-2" size={16} />
                            Save Changes
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      disabled
                      placeholder="Your email address"
                    />

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Account Type
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl dark:border-gray-600">
                        <Shield className="text-blue-600" size={20} />
                        <span className="font-medium text-gray-900 capitalize dark:text-white">
                          {user.role}
                        </span>
                        <Badge variant="outline" className="ml-auto">
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 mt-6 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-xl dark:border-blue-800"
                    >
                      <div className="flex items-center gap-3">
                        <Upload size={20} className="text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                            Profile Photo
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Click the camera icon to upload a new photo. Max size 5MB.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Achievements
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Track your learning progress and milestones
                      </p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {achievements.filter(a => a.earned).length} of {achievements.length} earned
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                      return (
                        <motion.div
                          key={achievement.name}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            achievement.earned
                              ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                              : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              achievement.earned
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-300 text-gray-500 dark:bg-gray-600'
                            }`}>
                              <Icon size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-semibold ${
                                achievement.earned
                                  ? 'text-green-900 dark:text-green-100'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {achievement.name}
                              </h4>
                              <p className={`text-sm ${
                                achievement.earned
                                  ? 'text-green-700 dark:text-green-300'
                                  : 'text-gray-400 dark:text-gray-500'
                              }`}>
                                {achievement.description}
                              </p>
                            </div>
                            {achievement.earned ? (
                              <CheckCircle size={20} className="text-green-500" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full dark:border-gray-600" />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
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
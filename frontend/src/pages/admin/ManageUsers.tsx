import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { User } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { 
  Eye, 
  Mail, 
  Search, 
  Filter,
  MoreVertical,
  UserPlus,
  Download,
  Shield,
  UserCheck,
  UserX,
  Calendar,
  ArrowUpDown,
  CheckCircle,
  XCircle
  ,Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import getSocket from '@/services/socket';

export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on('user:updated', (user: User) => {
      setUsers(prev => prev.map(u => ((u._id || u.id) === (user._id || user.id) ? { ...u, ...user } : u)));
    });
    socket.on('user:deleted', ({ id }: { id: string }) => {
      setUsers(prev => prev.filter(u => (u._id || u.id) !== id));
    });

    return () => {
      socket.off('user:updated');
      socket.off('user:deleted');
    };
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users?page=1&limit=50');
      const data = res.data?.data;
      // Mock additional user data for demo
      const mockUsers = (data?.users || []).map((user: User, index: number) => ({
        ...user,
        status: index % 5 === 0 ? 'inactive' : 'active',
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      setUsers(mockUsers);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || (user.status || 'active') === selectedStatus;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any = (a as any)[sortBy];
      let bValue: any = (b as any)[sortBy];
      
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

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle },
      inactive: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: XCircle },
    };
    const { color, icon: Icon } = variants[status as keyof typeof variants] || variants.active;
    
    return (
      <Badge className={`${color} gap-1 px-2 py-1 text-xs`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      user: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      moderator: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    };
    
    return (
      <Badge className={`${variants[role as keyof typeof variants] || variants.user} px-2 py-1 text-xs`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSort = (field: 'name' | 'email' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDeleteUser = async (id?: string) => {
    if (!id) return;
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => (u._id || u.id) !== id));
    } catch (err: any) {
      console.error('Failed to delete user', err);
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  const handleToggleStatus = async (id?: string, currentStatus: string = 'active') => {
    if (!id) return;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      // attempt to update on server; endpoint should accept { status }
      await api.patch(`/admin/users/${id}`, { status: newStatus });
      // update local state optimistically
      setUsers(prev => prev.map(u => ((u._id || u.id) === id ? { ...u, status: newStatus } : u)));
    } catch (err: any) {
      console.error('Failed to update user status', err);
      alert(err?.response?.data?.message || 'Failed to update status');
    }
  };

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
                      <div className="w-1/4 h-4 mb-2 bg-gray-200 rounded dark:bg-gray-700"></div>
                      <div className="w-1/3 h-3 bg-gray-200 rounded dark:bg-gray-700"></div>
                    </div>
                    <div className="w-24 h-8 bg-gray-200 rounded dark:bg-gray-700"></div>
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
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and monitor all registered users in your platform
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download size={18} />
              Export
            </Button>
            <Button className="gap-2 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
              <UserPlus size={18} />
              Add User
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Users', value: users.length, color: 'from-blue-500 to-blue-600', icon: Users },
            { label: 'Active Users', value: users.filter(u => u.status === 'active').length, color: 'from-green-500 to-green-600', icon: UserCheck },
            { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'from-purple-500 to-purple-600', icon: Shield },
            { label: 'Inactive', value: users.filter(u => u.status === 'inactive').length, color: 'from-red-500 to-red-600', icon: UserX },
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
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>
                
                <div className="flex flex-wrap w-full gap-3 lg:w-auto">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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

        {/* Users List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-6 text-sm font-medium text-gray-600 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                <div className="flex items-center col-span-4 gap-2">
                  <button 
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 transition-colors hover:text-gray-900 dark:hover:text-white"
                  >
                    User
                    <ArrowUpDown size={14} />
                  </button>
                </div>
                <div className="flex items-center col-span-3 gap-2">
                  <button 
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-1 transition-colors hover:text-gray-900 dark:hover:text-white"
                  >
                    Email
                    <ArrowUpDown size={14} />
                  </button>
                </div>
                <div className="col-span-2">Role</div>
                <div className="flex items-center col-span-2 gap-2">
                  <button 
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1 transition-colors hover:text-gray-900 dark:hover:text-white"
                  >
                    Joined
                    <ArrowUpDown size={14} />
                  </button>
                </div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Users List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {filteredUsers.map((user, index) => (
                    <motion.div
                      key={user._id || user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="grid items-center grid-cols-12 gap-4 p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div className="col-span-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusBadge(user.status || 'active')}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-3">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Mail size={14} />
                          {user.email}
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        {getRoleBadge(user.role)}
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar size={14} />
                          {formatDate(user.createdAt || new Date().toISOString())}
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => alert(`View profile: ${user.name}`)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="View profile"
                          >
                            <Eye size={16} />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => alert(`Email user: ${user.email}`)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                            title="Send email"
                          >
                            <Mail size={16} />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            title="More actions"
                          >
                            <MoreVertical size={16} />
                          </Button>

                          {/* hide destructive controls for admins */}
                          {user.role !== 'admin' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user._id || user.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Delete user"
                              >
                                <UserX size={16} />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleStatus(user._id || user.id, user.status || 'active')}
                                className={(user.status || 'active') === 'active'
                                  ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                                  : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                                }
                                title={(user.status || 'active') === 'active' ? 'Deactivate' : 'Activate'}
                              >
                                {(user.status || 'active') === 'active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Empty State */}
              {filteredUsers.length === 0 && (
                <div className="py-12 text-center">
                  <div className="mb-4 text-gray-400 dark:text-gray-500">
                    <Users size={48} className="mx-auto" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    No users found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ManageUsers;
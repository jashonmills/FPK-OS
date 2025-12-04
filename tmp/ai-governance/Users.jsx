
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Shield, BookOpen, GraduationCap, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Users = () => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('schoolUsers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Sarah Johnson', email: 'sarah.j@school.edu', role: 'student', grade: '10', status: 'active', aiUsage: 45 },
      { id: 2, name: 'Mike Davis', email: 'mike.d@school.edu', role: 'student', grade: '11', status: 'active', aiUsage: 62 },
      { id: 3, name: 'Emily Chen', email: 'emily.c@school.edu', role: 'teacher', department: 'Science', status: 'active', aiUsage: 38 },
      { id: 4, name: 'Alex Turner', email: 'alex.t@school.edu', role: 'student', grade: '9', status: 'active', aiUsage: 28 },
      { id: 5, name: 'Jennifer Smith', email: 'jennifer.s@school.edu', role: 'teacher', department: 'Math', status: 'active', aiUsage: 71 },
      { id: 6, name: 'Tom Wilson', email: 'tom.w@school.edu', role: 'student', grade: '12', status: 'active', aiUsage: 53 },
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return Shield;
      case 'teacher': return BookOpen;
      case 'student': return GraduationCap;
      default: return Shield;
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'teacher': return 'bg-blue-100 text-blue-700';
      case 'student': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage users and their AI access permissions</p>
        </div>
        <Button
          onClick={() => toast({
            title: "Add User",
            description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
          })}
          className="bg-gradient-to-r from-indigo-500 to-purple-600"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="teacher">Teachers</option>
            <option value="student">Students</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Details</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">AI Usage</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)} capitalize`}>
                        <RoleIcon className="h-3 w-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {user.role === 'student' ? `Grade ${user.grade}` : user.department}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[100px]">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                            style={{ width: `${user.aiUsage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{user.aiUsage}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toast({
                          title: "User Actions",
                          description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                        })}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;

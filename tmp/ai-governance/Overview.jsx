
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Activity, CheckCircle, XCircle, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

const Overview = () => {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('adminStats');
    return saved ? JSON.parse(saved) : {
      totalUsers: 342,
      activeRules: 12,
      todayActivity: 89,
      pendingApprovals: 7,
      approvedToday: 34,
      blockedToday: 5,
      complianceRate: 94
    };
  });

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-indigo-600', change: '+12' },
    { label: 'Active Rules', value: stats.activeRules, icon: Shield, color: 'from-purple-500 to-pink-600', change: '+2' },
    { label: 'Today\'s Activity', value: stats.todayActivity, icon: Activity, color: 'from-green-500 to-emerald-600', change: '+23' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: Clock, color: 'from-orange-500 to-red-600', change: '-3' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-1">Monitor and manage AI usage across your school</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {[
              { user: 'Sarah Johnson', action: 'Used AI for essay writing', status: 'approved', time: '5 min ago' },
              { user: 'Mike Davis', action: 'Requested AI code assistance', status: 'pending', time: '12 min ago' },
              { user: 'Emily Chen', action: 'AI math problem solver', status: 'approved', time: '23 min ago' },
              { user: 'Alex Turner', action: 'AI image generation', status: 'blocked', time: '45 min ago' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{activity.time}</span>
                  {activity.status === 'approved' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {activity.status === 'blocked' && <XCircle className="h-5 w-5 text-red-500" />}
                  {activity.status === 'pending' && <Clock className="h-5 w-5 text-orange-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Compliance Overview</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Compliance</span>
                <span className="text-sm font-bold text-green-600">{stats.complianceRate}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.complianceRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.approvedToday}</p>
                <p className="text-xs text-gray-600">Approved</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.blockedToday}</p>
                <p className="text-xs text-gray-600">Blocked</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const StudentOverview: React.FC = () => {
  const stats = [
    { label: 'AI Tasks Used', value: 24, icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
    { label: 'Approved', value: 18, icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
    { label: 'Pending', value: 3, icon: Clock, color: 'from-orange-500 to-red-600' },
    { label: 'Learning Progress', value: '78%', icon: TrendingUp, color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Student Dashboard</h2>
        <p className="text-muted-foreground mt-1">Track your AI-assisted learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl shadow-sm border border-border p-6"
            >
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} w-fit mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent AI Activities</h3>
        <div className="space-y-3">
          {[
            { task: 'Essay writing assistance', subject: 'English', status: 'approved', time: '1 hour ago' },
            { task: 'Math problem solving', subject: 'Mathematics', status: 'approved', time: '3 hours ago' },
            { task: 'Research helper', subject: 'History', status: 'pending', time: '5 hours ago' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{item.task}</p>
                <p className="text-sm text-muted-foreground">{item.subject}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  item.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {item.status}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;

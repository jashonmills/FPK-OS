import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, MessageSquare, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TeacherTabId } from './TeacherPanel';

interface TeacherOverviewProps {
  setActiveTab: (tab: TeacherTabId) => void;
}

const TeacherOverview: React.FC<TeacherOverviewProps> = ({ setActiveTab }) => {
  const stats = [
    { label: 'My Students', value: 28, icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'AI Requests', value: 12, icon: MessageSquare, color: 'from-purple-500 to-pink-600' },
    { label: 'Lessons Created', value: 45, icon: BookOpen, color: 'from-green-500 to-emerald-600' },
    { label: 'Engagement Rate', value: '87%', icon: TrendingUp, color: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Teacher Dashboard</h2>
          <p className="text-muted-foreground mt-1">Monitor your students' AI usage and manage your classroom</p>
        </div>
        <Button 
          onClick={() => setActiveTab('tools')} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Launch AI Tools
        </Button>
      </div>

      {/* Quick Actions Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">Create Your Next Lesson in Seconds</h3>
          <p className="text-primary-foreground/80 mb-6 max-w-xl">Use our new AI-powered tools to generate lesson plans, quizzes, and rubrics instantly. Focus on teaching, let AI handle the prep.</p>
          <Button 
            variant="secondary" 
            onClick={() => setActiveTab('tools')}
            className="bg-white text-primary hover:bg-white/90 border-none"
          >
            Open Creator Studio <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </motion.div>

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
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Student Activities</h3>
        <div className="space-y-3">
          {[
            { student: 'Sarah Johnson', activity: 'Used AI for essay outline', time: '10 min ago' },
            { student: 'Mike Davis', activity: 'Requested code assistance', time: '25 min ago' },
            { student: 'Emily Chen', activity: 'AI research helper', time: '1 hour ago' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <div>
                <p className="font-medium text-foreground">{item.student}</p>
                <p className="text-sm text-muted-foreground">{item.activity}</p>
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherOverview;

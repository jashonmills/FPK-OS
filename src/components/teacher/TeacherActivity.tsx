import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';

const TeacherActivity: React.FC = () => {
  // Mock data - will be replaced with real data from activity_log table
  const activities = [
    { id: 1, action: 'Created lesson plan with AI', time: '2 hours ago', student: 'Class 10A' },
    { id: 2, action: 'Generated quiz questions', time: '5 hours ago', student: 'Class 11B' },
    { id: 3, action: 'AI grading assistance', time: '1 day ago', student: 'Class 9C' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Activity Log</h2>
        <p className="text-muted-foreground mt-1">Your recent AI-assisted activities</p>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl shadow-sm border border-border p-6"
          >
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.student}</p>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {activity.time}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeacherActivity;

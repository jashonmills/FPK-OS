import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const TeacherStudents: React.FC = () => {
  // Mock data - will be replaced with real data from useOrgMembers hook
  const students = [
    { id: 1, name: 'Sarah Johnson', grade: '10', aiUsage: 45, status: 'active' },
    { id: 2, name: 'Mike Davis', grade: '11', aiUsage: 62, status: 'active' },
    { id: 3, name: 'Alex Turner', grade: '9', aiUsage: 28, status: 'active' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">My Students</h2>
        <p className="text-muted-foreground mt-1">Monitor your students' AI usage and progress</p>
      </div>

      <div className="grid gap-4">
        {students.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl shadow-sm border border-border p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{student.name}</h3>
                  <p className="text-sm text-muted-foreground">Grade {student.grade}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">AI Usage</p>
                <p className="text-lg font-bold text-primary">{student.aiUsage}%</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeacherStudents;

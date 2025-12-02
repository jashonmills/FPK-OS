import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Request {
  id: number;
  task: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const TeacherRequests: React.FC = () => {
  const [requests] = useState<Request[]>([
    { id: 1, task: 'Bulk quiz generation', status: 'pending', date: '2025-11-30' },
    { id: 2, task: 'Lesson plan creation', status: 'approved', date: '2025-11-28' },
  ]);

  const handleNewRequest = () => {
    toast.info("🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Requests</h2>
          <p className="text-muted-foreground mt-1">Submit and track your AI usage requests</p>
        </div>
        <Button onClick={handleNewRequest} className="bg-gradient-to-r from-primary to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="space-y-4">
        {requests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl shadow-sm border border-border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{request.task}</h3>
                <p className="text-sm text-muted-foreground">{request.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                request.status === 'approved' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : request.status === 'rejected'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
              }`}>
                {request.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeacherRequests;

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useStudentAIAnalytics } from '@/hooks/useStudentAIAnalytics';
import { useSearchParams } from 'react-router-dom';

const StudentRequests: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get('org') || undefined;
  const { requests, isLoading } = useStudentAIAnalytics(orgId);

  const handleNewRequest = () => {
    toast.info("New Request feature coming soon!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My AI Requests</h2>
          <p className="text-muted-foreground mt-1">Submit and track your AI assistance requests</p>
        </div>
        <Button onClick={handleNewRequest} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
          <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Requests Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You haven't submitted any AI assistance requests. Click "New Request" to get started.
          </p>
        </div>
      ) : (
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
                  <p className="text-sm text-muted-foreground">{request.category} • {request.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {request.priority !== 'normal' && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      request.priority === 'high' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {request.priority}
                    </span>
                  )}
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
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentRequests;

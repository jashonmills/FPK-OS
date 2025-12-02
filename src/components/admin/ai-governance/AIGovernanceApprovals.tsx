import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIGovernanceApprovals } from '@/hooks/useAIGovernanceApprovals';
import { supabase } from '@/integrations/supabase/client';

interface AIGovernanceApprovalsProps {
  orgId?: string;
}

const AIGovernanceApprovals: React.FC<AIGovernanceApprovalsProps> = ({ orgId }) => {
  const { pendingApprovals, isLoading, approveRequest, rejectRequest } = useAIGovernanceApprovals(orgId);

  const handleApprove = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return;
    approveRequest.mutate({ id, approvedBy: user.id });
  };

  const handleReject = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return;
    rejectRequest.mutate({ id, approvedBy: user.id });
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'low': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Pending Approvals</h2>
        <p className="text-muted-foreground mt-1">Review and approve AI usage requests</p>
      </div>

      {pendingApprovals.length === 0 ? (
        <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground">No pending approval requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {request.user_name || request.user_email || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-muted-foreground">{request.user_email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)} capitalize`}>
                    {request.priority} Priority
                  </span>
                  <span className="text-xs text-muted-foreground">{formatTimestamp(request.requested_at)}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">{request.task}</h4>
                {request.details && (
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{request.details}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                  {request.category}
                </span>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleReject(request.id)}
                    variant="outline"
                    disabled={rejectRequest.isPending}
                    className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(request.id)}
                    disabled={approveRequest.isPending}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIGovernanceApprovals;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUserPrimaryOrganization } from '@/hooks/useUserOrganization';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface TeacherRequestsProps {
  orgId?: string;
}

const TeacherRequests: React.FC<TeacherRequestsProps> = ({ orgId: propOrgId }) => {
  const { organization, isLoading: orgLoading } = useUserPrimaryOrganization();
  // Use prop orgId if provided, otherwise fall back to primary organization
  const orgId = propOrgId || organization?.organization_id || '';

  // Fetch requests from ai_governance_approvals
  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['teacher-requests', orgId],
    queryFn: async () => {
      if (!orgId) return [];
      
      const { data, error } = await supabase
        .from('ai_governance_approvals')
        .select('*')
        .eq('org_id', orgId)
        .order('requested_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching requests:', error);
        return [];
      }
      
      return (data || []).map(req => ({
        id: req.id,
        task: req.task,
        status: req.status as 'pending' | 'approved' | 'rejected',
        date: req.requested_at ? format(new Date(req.requested_at), 'yyyy-MM-dd') : 'Unknown',
      }));
    },
    enabled: !!orgId,
    staleTime: 1000 * 60 * 2,
  });

  const handleNewRequest = () => {
    toast.info("🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀");
  };

  const isLoading = (!propOrgId && orgLoading) || requestsLoading;

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
          <h2 className="text-2xl font-bold text-foreground">AI Requests</h2>
          <p className="text-muted-foreground mt-1">Submit and track your AI usage requests</p>
        </div>
        <Button onClick={handleNewRequest} className="bg-gradient-to-r from-primary to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No requests yet</h3>
          <p className="text-muted-foreground text-sm">
            Submit your first AI request to get started.
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
      )}
    </div>
  );
};

export default TeacherRequests;

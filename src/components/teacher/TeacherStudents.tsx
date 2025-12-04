import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, User, Loader2, AlertCircle } from 'lucide-react';
import { useOrgStudents, OrgStudent } from '@/hooks/useOrgStudents';
import { useUserPrimaryOrganization } from '@/hooks/useUserOrganization';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TeacherStudentsProps {
  orgId?: string;
}

const TeacherStudents: React.FC<TeacherStudentsProps> = ({ orgId: propOrgId }) => {
  const { organization, isLoading: orgLoading } = useUserPrimaryOrganization();
  // Use prop orgId if provided, otherwise fall back to primary organization
  const orgId = propOrgId || organization?.organization_id || '';
  
  const { students, isLoading: studentsLoading } = useOrgStudents(orgId);

  // Fetch AI usage stats for all students with linked accounts
  const linkedUserIds = students
    .filter(s => s.linked_user_id)
    .map(s => s.linked_user_id as string);

  const { data: aiUsageData = [] } = useQuery({
    queryKey: ['student-ai-usage', orgId, linkedUserIds],
    queryFn: async () => {
      if (linkedUserIds.length === 0) return [];
      
      // Get aggregated AI coach analytics per user (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from('ai_coach_analytics')
        .select('user_id, messages_sent, study_time_minutes')
        .in('user_id', linkedUserIds)
        .gte('session_date', thirtyDaysAgo.toISOString().split('T')[0]);
      
      if (error) {
        console.error('Error fetching AI usage:', error);
        return [];
      }
      
      // Aggregate by user_id
      const usageMap = new Map<string, { messages: number; time: number }>();
      (data || []).forEach(row => {
        const existing = usageMap.get(row.user_id) || { messages: 0, time: 0 };
        usageMap.set(row.user_id, {
          messages: existing.messages + (row.messages_sent || 0),
          time: existing.time + (row.study_time_minutes || 0),
        });
      });
      
      return Array.from(usageMap.entries()).map(([userId, stats]) => ({
        user_id: userId,
        ...stats,
      }));
    },
    enabled: linkedUserIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  // Create a map for quick lookup
  const aiUsageMap = new Map(aiUsageData.map(u => [u.user_id, u]));

  // Calculate AI usage percentage (based on messages sent relative to org average)
  const getAiUsageDisplay = (student: OrgStudent) => {
    if (!student.linked_user_id) return { value: 0, label: 'No account' };
    
    const usage = aiUsageMap.get(student.linked_user_id);
    if (!usage) return { value: 0, label: '0 messages' };
    
    return { 
      value: Math.min(usage.messages, 100), 
      label: `${usage.messages} messages` 
    };
  };

  // Only show loading if we don't have propOrgId and org is loading
  const isLoading = !propOrgId && orgLoading || studentsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!propOrgId && !organization) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>No organization found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">My Students</h2>
        <p className="text-muted-foreground mt-1">
          {students.length} student{students.length !== 1 ? 's' : ''} in your organization
        </p>
      </div>

      {students.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No students yet</h3>
          <p className="text-muted-foreground text-sm">
            Students will appear here once they join your organization.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {students.map((student, index) => {
            const aiUsage = getAiUsageDisplay(student);
            const initials = student.full_name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl shadow-sm border border-border p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={student.avatar_url} alt={student.full_name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {initials || <GraduationCap className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{student.full_name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {student.grade_level ? (
                          <span className="text-sm text-muted-foreground">
                            {student.grade_level}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground/60 italic">
                            No grade set
                          </span>
                        )}
                        <Badge 
                          variant={student.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">AI Usage (30d)</p>
                    <p className="text-lg font-bold text-primary">{aiUsage.label}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;

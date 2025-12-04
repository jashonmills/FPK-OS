import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, FileText, Activity, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { GoalProgressUpdateForm } from '@/components/goals/GoalProgressUpdateForm';
import { GoalProgressHistory } from '@/components/goals/GoalProgressHistory';
import { GoalLinkedEvidence } from '@/components/goals/GoalLinkedEvidence';
import { TeamDiscussion } from '@/components/shared/TeamDiscussion';
import { GoalEditDialog } from '@/components/goals/GoalEditDialog';

export default function GoalDetails() {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { selectedFamily, selectedStudent } = useFamily();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: goal, isLoading } = useQuery({
    queryKey: ['goal', goalId],
    queryFn: async () => {
      if (!goalId) throw new Error('Goal ID is required');
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('id', goalId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!goalId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse text-muted-foreground">Loading goal details...</div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Goal Not Found</CardTitle>
            <CardDescription>
              The requested goal could not be found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/goals')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Goals
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = goal.target_value && goal.current_value
    ? Math.min((goal.current_value / goal.target_value) * 100, 100)
    : 0;

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/goals')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Button>
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{goal.goal_title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                {goal.goal_type && (
                  <Badge variant="outline">{goal.goal_type}</Badge>
                )}
                {goal.target_date && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Target: {format(new Date(goal.target_date), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button variant="outline" onClick={() => setShowEditDialog(true)}>
              Edit Goal
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goal.goal_description && (
            <p className="text-muted-foreground">{goal.goal_description}</p>
          )}
          
          {goal.target_value && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Progress</span>
                <div className="text-right">
                  <div className="text-3xl font-bold">{Math.round(progress)}%</div>
                  <div className="text-sm text-muted-foreground">
                    {goal.current_value || 0} / {goal.target_value} {goal.unit || ''}
                  </div>
                </div>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}

          <Button onClick={() => setShowUpdateForm(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Progress Update
          </Button>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">
            <Activity className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="evidence">
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Evidence</span>
          </TabsTrigger>
          <TabsTrigger value="discussion">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Discussion</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-6">
          <GoalProgressHistory goalId={goal.id} />
        </TabsContent>

        <TabsContent value="evidence" className="mt-6">
          <GoalLinkedEvidence 
            goalId={goal.id}
            familyId={goal.family_id}
            studentId={goal.student_id}
          />
        </TabsContent>

        <TabsContent value="discussion" className="mt-6">
          <TeamDiscussion 
            entityType="goal"
            entityId={goal.id}
            familyId={goal.family_id}
            title="Goal Discussion"
            placeholder="Discuss strategies, share progress updates, or ask questions about this goal..."
          />
        </TabsContent>
      </Tabs>

      {/* Progress Update Form Dialog */}
      {showUpdateForm && (
        <GoalProgressUpdateForm
          open={showUpdateForm}
          onOpenChange={setShowUpdateForm}
          goal={goal}
          onSuccess={() => {
            setShowUpdateForm(false);
            queryClient.invalidateQueries({ queryKey: ['goal', goalId] });
            queryClient.invalidateQueries({ queryKey: ['goal-progress-history', goalId] });
          }}
        />
      )}

      {/* Goal Edit Dialog */}
      {showEditDialog && (
        <GoalEditDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          goal={goal}
          onSuccess={() => {
            setShowEditDialog(false);
            queryClient.invalidateQueries({ queryKey: ['goal', goalId] });
          }}
        />
      )}
    </div>
  );
}

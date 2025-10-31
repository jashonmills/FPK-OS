import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, TrendingUp, Calendar } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ProductTour } from '@/components/onboarding/ProductTour';
import { goalsTourSteps } from '@/components/onboarding/tourConfigs';
import { useTourProgress } from '@/hooks/useTourProgress';

const Goals = () => {
  const navigate = useNavigate();
  const { selectedFamily, selectedStudent } = useFamily();
  const queryClient = useQueryClient();
  const { shouldRunTour, markTourAsSeen } = useTourProgress('has_seen_goals_tour');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalType, setGoalType] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { data: goals, isLoading } = useQuery({
    queryKey: ['goals', selectedFamily?.id, selectedStudent?.id],
    queryFn: async () => {
      if (!selectedFamily?.id || !selectedStudent?.id) return [];
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('family_id', selectedFamily.id)
        .eq('student_id', selectedStudent.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedFamily?.id && !!selectedStudent?.id,
  });

  const handleCreateGoal = async () => {
    if (!selectedFamily?.id || !selectedStudent?.id) {
      toast.error('Please select a family and student');
      return;
    }

    if (!goalTitle.trim()) {
      toast.error('Please enter a goal title');
      return;
    }

    setIsCreating(true);
    try {
      const { error } = await supabase.from('goals').insert({
        family_id: selectedFamily.id,
        student_id: selectedStudent.id,
        goal_title: goalTitle,
        goal_description: goalDescription || null,
        goal_type: goalType || 'general',
        target_value: targetValue ? parseFloat(targetValue) : null,
        target_date: targetDate || null,
      });

      if (error) throw error;

      toast.success('Goal created successfully!');
      setCreateModalOpen(false);
      setGoalTitle('');
      setGoalDescription('');
      setGoalType('');
      setTargetValue('');
      setTargetDate('');
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    } catch (error: any) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  if (!selectedStudent) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>No Student Selected</CardTitle>
            <CardDescription>
              Please select a student to view and manage goals
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse text-muted-foreground">Loading goals...</div>
      </div>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Goals</h1>
            <p className="text-muted-foreground">
              Track progress for {selectedStudent.student_name}
            </p>
          </div>
        </div>

        <EmptyState
          icon={Target}
          title="Track Progress with Measurable Goals"
          description="Setting clear goals is key to measuring progress. Here, you can define academic, behavioral, or developmental goals. You can create them yourself or use our AI to generate suggestions based on your uploaded documents."
          actionLabel="Create Your First Goal"
          onAction={() => setCreateModalOpen(true)}
        />

        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Define a measurable goal to track progress over time
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g., Increase independent task completion"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  placeholder="Describe the goal and how progress will be measured..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="type">Goal Type</Label>
                <Select value={goalType} onValueChange={setGoalType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="motor">Motor Skills</SelectItem>
                    <SelectItem value="self-care">Self-Care</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target">Target Value</Label>
                  <Input
                    id="target"
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder="e.g., 80"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Target Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCreateModalOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateGoal} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Goal'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <>
      <ProductTour 
        run={shouldRunTour} 
        onComplete={markTourAsSeen}
        tourSteps={goalsTourSteps}
        tourTitle="Welcome to Goals"
        tourDescription="Set and track measurable goals for your child's development. Ready to get started?"
      />
      
      <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Goals</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Track progress for {selectedStudent.student_name}
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} size="sm" className="text-xs sm:text-sm">
          <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Create Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = goal.target_value && goal.current_value
            ? Math.min((goal.current_value / goal.target_value) * 100, 100)
            : 0;

          return (
            <Card 
              key={goal.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/goals/${goal.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{goal.goal_title}</CardTitle>
                    {goal.goal_type && (
                      <Badge variant="outline" className="mb-2">
                        {goal.goal_type}
                      </Badge>
                    )}
                  </div>
                  {goal.target_value && (
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {Math.round(progress)}%
                      </div>
                    </div>
                  )}
                </div>
                {goal.goal_description && (
                  <CardDescription className="mt-2 line-clamp-2">
                    {goal.goal_description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {goal.target_value && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {goal.current_value || 0} / {goal.target_value}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
                {goal.target_date && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Target: {format(new Date(goal.target_date), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              Define a measurable goal to track progress over time
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Goal Title *</Label>
              <Input
                id="title"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g., Increase independent task completion"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                placeholder="Describe the goal and how progress will be measured..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="type">Goal Type</Label>
              <Select value={goalType} onValueChange={setGoalType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="motor">Motor Skills</SelectItem>
                  <SelectItem value="self-care">Self-Care</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target">Target Value</Label>
                <Input
                  id="target"
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="e.g., 80"
                />
              </div>
              <div>
                <Label htmlFor="date">Target Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCreateModalOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateGoal} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Goal'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
};

export default Goals;

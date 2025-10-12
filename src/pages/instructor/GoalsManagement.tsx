import React, { useState } from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useOrgGoals } from '@/hooks/useOrgGoals';
import { OrgCard, OrgCardContent, OrgCardHeader, OrgCardTitle, OrgCardDescription } from '@/components/organizations/OrgCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Target, Users, TrendingUp, Plus, Filter, Flag, Search, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function GoalsManagement() {
  const { currentOrg } = useOrgContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'learning',
    priority: 'medium',
    student_id: ''
  });

  if (!currentOrg) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <OrgCard>
          <OrgCardContent className="p-8 text-center">
            <p className="text-purple-200">No organization selected</p>
          </OrgCardContent>
        </OrgCard>
      </div>
    );
  }

  // Use real goals from useOrgGoals hook
  const { 
    goals, 
    isLoading,
    createGoal,
    updateGoal 
  } = useOrgGoals(currentOrg?.organization_id);

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <div className="ml-3 text-gray-500">Loading goals...</div>
        </div>
      </div>
    );
  }

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Goal title is required');
      return;
    }

    if (!formData.student_id) {
      toast.error('Student ID is required');
      return;
    }

    try {
      await createGoal({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        student_id: formData.student_id
      });
      
      toast.success('Goal created successfully!');
      setDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        category: 'learning',
        priority: 'medium',
        student_id: ''
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'default';
      case 'engagement': return 'secondary';
      case 'retention': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Goals</h1>
          <p className="text-white/80 mt-2 drop-shadow">
            Set and track organizational learning goals for your students
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter goal title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter goal description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="retention">Retention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="student_id">Student ID</Label>
                <Input
                  id="student_id"
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  placeholder="Enter student ID"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Goal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-white/70" />
              <span className="text-sm font-medium text-white">Total Goals</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-white">{goals.length}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-white/70" />
              <span className="text-sm font-medium text-white">Active Goals</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-blue-300">{goals.filter(g => g.status === 'active').length}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white/70" />
              <span className="text-sm font-medium text-white">Achieved</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-green-300">{goals.filter(g => g.status === 'completed').length}</div>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard className="bg-orange-500/65 border-orange-400/50">
          <OrgCardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">Avg Progress</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-white">
              {goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + (goal.progress_percentage || 0), 0) / goals.length) : 0}%
            </div>
          </OrgCardContent>
        </OrgCard>
      </div>

      {/* Search and Filters */}
      <OrgCard className="bg-orange-500/65 border-orange-400/50">
        <OrgCardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
              <Input 
                placeholder="Search goals..." 
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </OrgCardHeader>
      </OrgCard>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <OrgCard className="bg-purple-600/80 border-purple-500/50">
            <OrgCardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-purple-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Goals Set</h3>
              <p className="text-purple-200">Create organizational goals to track progress and performance metrics.</p>
            </OrgCardContent>
          </OrgCard>
        ) : (
          goals.map((goal) => {
            const progressPercentage = goal.progress_percentage || 0;
            
            return (
              <OrgCard key={goal.id} className="bg-orange-500/65 border-orange-400/50">
                <OrgCardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <OrgCardTitle className="text-white text-lg">{goal.title}</OrgCardTitle>
                      <OrgCardDescription className="text-orange-100">
                        {goal.description}
                      </OrgCardDescription>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">{goal.category}</Badge>
                        <Badge variant={goal.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {goal.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {progressPercentage}%
                      </div>
                      <div className="text-xs text-orange-200">Progress</div>
                    </div>
                  </div>
                </OrgCardHeader>
                <OrgCardContent className="pt-3">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-orange-200">Current Progress</span>
                        <span className="text-white font-medium">{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-orange-800/40 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-300 to-orange-100 h-2 rounded-full transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-orange-200">
                      <span>Target Date: {new Date(goal.target_date).toLocaleDateString()}</span>
                      <span>Status: {goal.status}</span>
                    </div>
                  </div>
                </OrgCardContent>
              </OrgCard>
            );
          })
        )}
      </div>
    </div>
  );
}
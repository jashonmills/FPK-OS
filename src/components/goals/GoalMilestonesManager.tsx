import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import { GoalMilestone } from '@/types/goals';
import { useToast } from '@/hooks/use-toast';

interface GoalMilestonesManagerProps {
  milestones: GoalMilestone[];
  onChange: (milestones: GoalMilestone[]) => void;
  onMilestoneComplete?: (milestoneId: string) => void;
}

const GoalMilestonesManager: React.FC<GoalMilestonesManagerProps> = ({
  milestones,
  onChange,
  onMilestoneComplete
}) => {
  const { toast } = useToast();
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    estimatedHours: ''
  });

  const addMilestone = () => {
    if (!newMilestone.title.trim()) {
      toast({
        title: "Error",
        description: "Milestone title is required",
        variant: "destructive",
      });
      return;
    }

    const milestone: GoalMilestone = {
      id: `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newMilestone.title.trim(),
      description: newMilestone.description.trim() || undefined,
      completed: false,
      order: milestones.length + 1,
      estimatedHours: newMilestone.estimatedHours ? parseInt(newMilestone.estimatedHours) : undefined
    };

    onChange([...milestones, milestone]);
    setNewMilestone({ title: '', description: '', estimatedHours: '' });
  };

  const removeMilestone = (id: string) => {
    const updatedMilestones = milestones
      .filter(m => m.id !== id)
      .map((m, index) => ({ ...m, order: index + 1 }));
    onChange(updatedMilestones);
  };

  const updateMilestone = (id: string, updates: Partial<GoalMilestone>) => {
    const updatedMilestones = milestones.map(m => 
      m.id === id ? { ...m, ...updates } : m
    );
    onChange(updatedMilestones);
  };

  const toggleMilestoneComplete = (milestone: GoalMilestone) => {
    const newCompleted = !milestone.completed;
    const updates: Partial<GoalMilestone> = {
      completed: newCompleted,
      completedAt: newCompleted ? new Date().toISOString() : undefined
    };

    updateMilestone(milestone.id, updates);
    
    if (newCompleted && onMilestoneComplete) {
      onMilestoneComplete(milestone.id);
    }
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercentage = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Milestones</Label>
          {milestones.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({completedCount}/{milestones.length} completed - {progressPercentage}%)
            </span>
          )}
        </div>
      </div>

      {/* Existing Milestones */}
      {milestones.length > 0 && (
        <div className="space-y-2">
          {milestones
            .sort((a, b) => a.order - b.order)
            .map((milestone) => (
              <Card key={milestone.id} className="border border-border/50">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center mt-1">
                      <GripVertical className="h-3 w-3 text-muted-foreground mr-1" />
                      <Checkbox
                        checked={milestone.completed}
                        onCheckedChange={() => toggleMilestoneComplete(milestone)}
                        className="h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`font-medium text-sm ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {milestone.title}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMilestone(milestone.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {milestone.description && (
                        <p className={`text-xs text-muted-foreground ${milestone.completed ? 'line-through' : ''}`}>
                          {milestone.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {milestone.estimatedHours && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{milestone.estimatedHours}h estimated</span>
                          </div>
                        )}
                        {milestone.completed && milestone.completedAt && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>Completed {new Date(milestone.completedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Add New Milestone */}
      <Card className="border-dashed border-2 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Milestone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="milestone-title" className="text-xs">Title</Label>
            <Input
              id="milestone-title"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              placeholder="e.g., Complete Chapter 1"
              className="text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="milestone-description" className="text-xs">Description (Optional)</Label>
            <Textarea
              id="milestone-description"
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
              placeholder="Add details about this milestone..."
              rows={2}
              className="text-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="milestone-hours" className="text-xs">Estimated Hours</Label>
              <Input
                id="milestone-hours"
                type="number"
                value={newMilestone.estimatedHours}
                onChange={(e) => setNewMilestone({ ...newMilestone, estimatedHours: e.target.value })}
                placeholder="Hours"
                min="0"
                className="text-sm"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={addMilestone}
                size="sm"
                className="w-full"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalMilestonesManager;

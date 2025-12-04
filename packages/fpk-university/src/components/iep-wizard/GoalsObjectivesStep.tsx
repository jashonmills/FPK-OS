import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Goal {
  id: string;
  domain: string;
  measurableGoal: string;
  objectives: Objective[];
  evaluationCriteria: string;
  evaluationSchedule: string;
  responsiblePersons: string;
}

interface Objective {
  id: string;
  description: string;
  criteria: string;
  timeline: string;
}

interface GoalsObjectivesStepProps {
  data: any;
  onUpdate: (data: any) => void;
  jurisdiction: 'US_IDEA' | 'IE_EPSEN';
}

export function GoalsObjectivesStep({ data, onUpdate, jurisdiction }: GoalsObjectivesStepProps) {
  const [isGeneratingGoals, setIsGeneratingGoals] = useState(false);
  
  // Add safety checks for data structure
  const goals: Goal[] = Array.isArray(data.goals) ? data.goals : [];

  const updateData = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const domains = [
    'Reading',
    'Writing',
    'Mathematics',
    'Communication',
    'Social/Emotional/Behavioral',
    'Motor Skills',
    'Independent Living Skills',
    'Vocational Skills',
    'Transition Skills'
  ];

  const addGoal = () => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      domain: '',
      measurableGoal: '',
      objectives: [],
      evaluationCriteria: '',
      evaluationSchedule: '',
      responsiblePersons: ''
    };
    updateData('goals', [...goals, newGoal]);
  };

  const updateGoal = (goalId: string, field: keyof Goal, value: any) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, [field]: value } : goal
    );
    updateData('goals', updatedGoals);
  };

  const removeGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    updateData('goals', updatedGoals);
  };

  const addObjective = (goalId: string) => {
    const newObjective: Objective = {
      id: `obj-${Date.now()}`,
      description: '',
      criteria: '',
      timeline: ''
    };
    
    const updatedGoals = goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, objectives: [...(goal.objectives || []), newObjective] }
        : goal
    );
    updateData('goals', updatedGoals);
  };

  const updateObjective = (goalId: string, objectiveId: string, field: keyof Objective, value: string) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId 
        ? {
            ...goal,
            objectives: (goal.objectives || []).map(obj => 
              obj.id === objectiveId ? { ...obj, [field]: value } : obj
            )
          }
        : goal
    );
    updateData('goals', updatedGoals);
  };

  const removeObjective = (goalId: string, objectiveId: string) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId 
        ? {
            ...goal,
            objectives: (goal.objectives || []).filter(obj => obj.id !== objectiveId)
          }
        : goal
    );
    updateData('goals', updatedGoals);
  };

  const generateSMARTGoals = async () => {
    setIsGeneratingGoals(true);
    try {
      // This would integrate with an AI service to generate SMART goals
      // For now, we'll show a placeholder
      toast.info('AI-powered SMART goal generation coming soon!');
    } catch (error) {
      toast.error('Failed to generate goals');
    } finally {
      setIsGeneratingGoals(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">SMART Goals and Objectives</h3>
          <p className="text-sm text-muted-foreground">
            Create Specific, Measurable, Achievable, Relevant, and Time-bound goals
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={generateSMARTGoals}
            disabled={isGeneratingGoals}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isGeneratingGoals ? 'Generating...' : 'AI Generate Goals'}
          </Button>
          <Button type="button" onClick={addGoal} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Goal
          </Button>
        </div>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No goals added yet</p>
            <Button onClick={addGoal} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        goals.map((goal, goalIndex) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Goal {goalIndex + 1}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGoal(goal.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`domain-${goal.id}`}>Domain/Area</Label>
                <Select
                  value={goal.domain}
                  onValueChange={(value) => updateGoal(goal.id, 'domain', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`goal-${goal.id}`}>Measurable Annual Goal</Label>
                <Textarea
                  id={`goal-${goal.id}`}
                  placeholder="By [date], given [condition], [student] will [behavior] at [criteria] as measured by [method]..."
                  value={goal.measurableGoal}
                  onChange={(e) => updateGoal(goal.id, 'measurableGoal', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Short-term Objectives</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addObjective(goal.id)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Objective
                  </Button>
                </div>
                
                {(goal.objectives || []).map((objective, objIndex) => (
                  <Card key={objective.id} className="p-4 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Objective {objIndex + 1}</h5>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeObjective(goal.id, objective.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`obj-desc-${objective.id}`}>Objective Description</Label>
                        <Textarea
                          id={`obj-desc-${objective.id}`}
                          placeholder="Describe the specific objective..."
                          value={objective.description}
                          onChange={(e) => updateObjective(goal.id, objective.id, 'description', e.target.value)}
                          rows={2}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`obj-criteria-${objective.id}`}>Success Criteria</Label>
                          <Input
                            id={`obj-criteria-${objective.id}`}
                            placeholder="e.g., 80% accuracy over 3 trials"
                            value={objective.criteria}
                            onChange={(e) => updateObjective(goal.id, objective.id, 'criteria', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`obj-timeline-${objective.id}`}>Timeline</Label>
                          <Input
                            id={`obj-timeline-${objective.id}`}
                            placeholder="e.g., by December 2024"
                            value={objective.timeline}
                            onChange={(e) => updateObjective(goal.id, objective.id, 'timeline', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`evaluation-criteria-${goal.id}`}>Evaluation Criteria</Label>
                  <Textarea
                    id={`evaluation-criteria-${goal.id}`}
                    placeholder="How will progress be measured?"
                    value={goal.evaluationCriteria}
                    onChange={(e) => updateGoal(goal.id, 'evaluationCriteria', e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor={`evaluation-schedule-${goal.id}`}>Evaluation Schedule</Label>
                  <Input
                    id={`evaluation-schedule-${goal.id}`}
                    placeholder="e.g., Monthly, Quarterly"
                    value={goal.evaluationSchedule}
                    onChange={(e) => updateGoal(goal.id, 'evaluationSchedule', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`responsible-persons-${goal.id}`}>Responsible Persons</Label>
                <Input
                  id={`responsible-persons-${goal.id}`}
                  placeholder="Who will be responsible for implementing this goal?"
                  value={goal.responsiblePersons}
                  onChange={(e) => updateGoal(goal.id, 'responsiblePersons', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
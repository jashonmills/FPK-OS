import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';
import { Plus, Trash2, Sparkles } from 'lucide-react';

const GOAL_DOMAINS = [
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

export const GoalsObjectivesStep = ({ data, onUpdate }: WizardStepProps) => {
  const goals = data.goals || [];

  const addGoal = () => {
    onUpdate({
      ...data,
      goals: [...goals, { domain: '', goal: '', objectives: [], evaluationCriteria: '', evaluationSchedule: '', responsiblePersons: '' }]
    });
  };

  const removeGoal = (index: number) => {
    onUpdate({
      ...data,
      goals: goals.filter((_: any, i: number) => i !== index)
    });
  };

  const updateGoal = (index: number, field: string, value: any) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = { ...updatedGoals[index], [field]: value };
    onUpdate({ ...data, goals: updatedGoals });
  };

  const addObjective = (goalIndex: number) => {
    const updatedGoals = [...goals];
    const objectives = updatedGoals[goalIndex].objectives || [];
    updatedGoals[goalIndex].objectives = [...objectives, { description: '', successCriteria: '', timeline: '' }];
    onUpdate({ ...data, goals: updatedGoals });
  };

  const removeObjective = (goalIndex: number, objectiveIndex: number) => {
    const updatedGoals = [...goals];
    updatedGoals[goalIndex].objectives = updatedGoals[goalIndex].objectives.filter((_: any, i: number) => i !== objectiveIndex);
    onUpdate({ ...data, goals: updatedGoals });
  };

  const updateObjective = (goalIndex: number, objectiveIndex: number, field: string, value: string) => {
    const updatedGoals = [...goals];
    const objectives = [...updatedGoals[goalIndex].objectives];
    objectives[objectiveIndex] = { ...objectives[objectiveIndex], [field]: value };
    updatedGoals[goalIndex].objectives = objectives;
    onUpdate({ ...data, goals: updatedGoals });
  };

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="Measurable annual goals are the heart of the IEP, describing what the student will accomplish in one year."
        why="Goals must be SMART (Specific, Measurable, Achievable, Relevant, Time-bound) to ensure accountability and progress tracking."
        how="For each goal, select a domain, write a measurable goal statement, add short-term objectives, and specify evaluation methods."
      />

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Annual Goals</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {}}
            disabled
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Generate Goals
          </Button>
          <Button type="button" onClick={addGoal} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </div>

      {goals.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No goals added yet. Click "Add Goal" to begin.</p>
        </div>
      )}

      <div className="space-y-6">
        {goals.map((goal: any, goalIndex: number) => (
          <div key={goalIndex} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">Goal {goalIndex + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeGoal(goalIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Domain/Area *</Label>
                <Select
                  value={goal.domain || ''}
                  onValueChange={(value) => updateGoal(goalIndex, 'domain', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_DOMAINS.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Measurable Annual Goal *</Label>
                <Textarea
                  value={goal.goal || ''}
                  onChange={(e) => updateGoal(goalIndex, 'goal', e.target.value)}
                  placeholder="By [date], [student] will [observable behavior] at [criterion level] as measured by [method]..."
                  rows={3}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Short-Term Objectives</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addObjective(goalIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Objective
                  </Button>
                </div>

                <div className="space-y-3">
                  {(goal.objectives || []).map((objective: any, objIndex: number) => (
                    <div key={objIndex} className="border rounded p-3 space-y-2 bg-muted/30">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium">Objective {objIndex + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeObjective(goalIndex, objIndex)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          value={objective.description || ''}
                          onChange={(e) => updateObjective(goalIndex, objIndex, 'description', e.target.value)}
                          placeholder="Specific, measurable objective..."
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Success Criteria</Label>
                          <Input
                            value={objective.successCriteria || ''}
                            onChange={(e) => updateObjective(goalIndex, objIndex, 'successCriteria', e.target.value)}
                            placeholder="e.g., 80% accuracy over 3 trials"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Timeline</Label>
                          <Input
                            value={objective.timeline || ''}
                            onChange={(e) => updateObjective(goalIndex, objIndex, 'timeline', e.target.value)}
                            placeholder="e.g., by end of Q2"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Evaluation Criteria</Label>
                  <Textarea
                    value={goal.evaluationCriteria || ''}
                    onChange={(e) => updateGoal(goalIndex, 'evaluationCriteria', e.target.value)}
                    placeholder="How will progress toward this goal be measured?"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Evaluation Schedule</Label>
                  <Input
                    value={goal.evaluationSchedule || ''}
                    onChange={(e) => updateGoal(goalIndex, 'evaluationSchedule', e.target.value)}
                    placeholder="e.g., Weekly, Monthly, Quarterly"
                  />
                </div>
              </div>

              <div>
                <Label>Responsible Persons</Label>
                <Input
                  value={goal.responsiblePersons || ''}
                  onChange={(e) => updateGoal(goalIndex, 'responsiblePersons', e.target.value)}
                  placeholder="Who will implement and monitor this goal?"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
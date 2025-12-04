import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TextareaWithVoice } from '@/components/shared/TextareaWithVoice';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';

export const BehaviorDefinitionStep = ({ data, onUpdate }: WizardStepProps) => {
  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="Define the target behavior with clinical precision."
        why="Being crystal clear about exactly what we're looking at is the foundation for collecting accurate data. If we can't define it precisely, we can't measure it effectively."
        how="Describe the behavior so specifically that anyone observing could recognize it and record it the same way. Include what it looks like, and importantly, what it does NOT include."
      />

      <div className="space-y-2">
        <Label htmlFor="behaviorName">
          Behavior Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="behaviorName"
          value={data.behaviorName || ''}
          onChange={(e) => onUpdate({ ...data, behaviorName: e.target.value })}
          placeholder="e.g., Elopement, Hand-flapping, Task refusal"
        />
        <p className="text-xs text-muted-foreground">A simple, one or two-word label for this behavior</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="operationalDefinition">
          Operational Definition <span className="text-destructive">*</span>
        </Label>
        <TextareaWithVoice
          id="operationalDefinition"
          value={data.operationalDefinition || ''}
          onChange={(e) => onUpdate({ ...data, operationalDefinition: e.target.value })}
          placeholder="Example: 'Any instance of the child moving more than 10 feet away from a supervising adult without permission, including running out of the room, leaving the yard, or walking away during transitions.'"
          rows={5}
        />
        <p className="text-xs text-muted-foreground">Describe exactly what the behavior looks like so anyone could recognize it. Be specific and objective.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nonExamples">
          Non-Examples (What This Is NOT)
        </Label>
        <TextareaWithVoice
          id="nonExamples"
          value={data.nonExamples || ''}
          onChange={(e) => onUpdate({ ...data, nonExamples: e.target.value })}
          placeholder="Example: 'This does not include walking to a designated area as part of a planned transition, or moving away when given explicit permission.'"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">Help clarify the boundary by describing similar actions that should NOT be counted</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="frequency">Estimated Frequency (per day)</Label>
          <Input
            id="frequency"
            type="number"
            value={data.frequency || ''}
            onChange={(e) => onUpdate({ ...data, frequency: e.target.value })}
            placeholder="e.g., 3-5"
          />
          <p className="text-xs text-muted-foreground">Your best estimate</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Typical Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={data.duration || ''}
            onChange={(e) => onUpdate({ ...data, duration: e.target.value })}
            placeholder="e.g., 10"
          />
          <p className="text-xs text-muted-foreground">How long it usually lasts</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="intensity">Intensity Level</Label>
        <Input
          id="intensity"
          value={data.intensity || ''}
          onChange={(e) => onUpdate({ ...data, intensity: e.target.value })}
          placeholder="Low, Moderate, High, or describe the severity..."
        />
      </div>
    </div>
  );
};
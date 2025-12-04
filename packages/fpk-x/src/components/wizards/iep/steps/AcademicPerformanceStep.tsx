import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { TextareaWithVoice } from '@/components/shared/TextareaWithVoice';

export const AcademicPerformanceStep = ({ data, onUpdate }: WizardStepProps) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="strengths">
        Academic Strengths <span className="text-destructive">*</span>
      </Label>
      <TextareaWithVoice
        id="strengths"
        value={data.strengths || ''}
        onChange={(e) => onUpdate({ ...data, strengths: e.target.value })}
        placeholder="Describe specific academic strengths..."
        rows={4}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="weaknesses">
        Areas for Growth <span className="text-destructive">*</span>
      </Label>
      <TextareaWithVoice
        id="weaknesses"
        value={data.weaknesses || ''}
        onChange={(e) => onUpdate({ ...data, weaknesses: e.target.value })}
        placeholder="Describe specific areas needing support..."
        rows={4}
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="currentData">
        Supporting Data
      </Label>
      <TextareaWithVoice
        id="currentData"
        value={data.currentData || ''}
        onChange={(e) => onUpdate({ ...data, currentData: e.target.value })}
        placeholder="Include test scores, grades, observations..."
        rows={4}
      />
    </div>
  </div>
);

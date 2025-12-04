import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';

export const AssessmentParticipationStep = ({ data, onUpdate }: WizardStepProps) => {
  const jurisdiction = data.jurisdiction || 'US';

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="This step determines how the student will participate in state and district-wide assessments."
        why="Federal law requires that all students with disabilities participate in assessments, either with accommodations or through alternate assessments."
        how="For each assessment, select the participation method and document any accommodations or rationale for alternate assessment."
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">State Academic Assessments</h3>
        <RadioGroup
          value={data.stateAssessmentMethod || ''}
          onValueChange={(value) => onUpdate({ ...data, stateAssessmentMethod: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="font-normal cursor-pointer">
              Standard assessment (with or without accommodations)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="alternate" id="alternate" />
            <Label htmlFor="alternate" className="font-normal cursor-pointer">
              Alternate assessment
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="exempt" id="exempt" />
            <Label htmlFor="exempt" className="font-normal cursor-pointer">
              Exempt from assessment
            </Label>
          </div>
        </RadioGroup>

        {data.stateAssessmentMethod === 'alternate' && (
          <div>
            <Label>Rationale for Alternate Assessment</Label>
            <Textarea
              value={data.alternateRationale || ''}
              onChange={(e) => onUpdate({ ...data, alternateRationale: e.target.value })}
              placeholder="Explain why the student cannot participate in standard assessment even with accommodations..."
              rows={3}
            />
          </div>
        )}

        {data.stateAssessmentMethod === 'exempt' && (
          <div>
            <Label>Rationale for Exemption</Label>
            <Textarea
              value={data.exemptionRationale || ''}
              onChange={(e) => onUpdate({ ...data, exemptionRationale: e.target.value })}
              placeholder="Explain why the student is exempt from this assessment..."
              rows={3}
            />
          </div>
        )}

        <div>
          <Label>Assessment Accommodations</Label>
          <Textarea
            value={data.assessmentAccommodations || ''}
            onChange={(e) => onUpdate({ ...data, assessmentAccommodations: e.target.value })}
            placeholder="List all accommodations needed for assessment participation (extended time, read-aloud, separate setting, etc.)..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};
import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';

const US_PLACEMENTS = [
  { value: 'general-ed', label: 'General Education Classroom' },
  { value: 'resource-room', label: 'Resource Room' },
  { value: 'special-ed-class', label: 'Special Education Class' },
  { value: 'separate-school', label: 'Separate School' },
  { value: 'residential', label: 'Residential Facility' },
  { value: 'homebound', label: 'Homebound/Hospital' }
];

const IRELAND_PLACEMENTS = [
  { value: 'mainstream', label: 'Mainstream Class' },
  { value: 'mainstream-support', label: 'Mainstream with Support' },
  { value: 'special-class', label: 'Special Class' },
  { value: 'special-school', label: 'Special School' },
  { value: 'home-tuition', label: 'Home Tuition' }
];

const LRE_FACTORS = [
  'Academic needs of the student',
  'Social and emotional needs',
  'Communication needs',
  'Behavioral needs',
  'Physical and health needs',
  'Need for related services',
  'Availability of appropriate services',
  'Potential beneficial or harmful effects on the student',
  'Potential beneficial or harmful effects on other students'
];

export const LREPlacementStep = ({ data, onUpdate }: WizardStepProps) => {
  const jurisdiction = data.jurisdiction || 'US';
  const placements = jurisdiction === 'US' ? US_PLACEMENTS : IRELAND_PLACEMENTS;
  const lreFactors = data.lreFactors || [];

  const toggleLREFactor = (factor: string) => {
    const updated = lreFactors.includes(factor)
      ? lreFactors.filter((f: string) => f !== factor)
      : [...lreFactors, factor];
    onUpdate({ ...data, lreFactors: updated });
  };

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="Least Restrictive Environment (LRE) requires that students with disabilities be educated with non-disabled peers to the maximum extent appropriate."
        why="Federal law (IDEA) mandates that placement decisions be individualized and based on the student's needs, not solely on the disability category."
        how="Select the placement that provides the student with the services they need while maximizing time with non-disabled peers. Document the justification clearly."
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Educational Placement</h3>
        <RadioGroup
          value={data.placement || ''}
          onValueChange={(value) => onUpdate({ ...data, placement: value })}
        >
          {placements.map((placement) => (
            <div key={placement.value} className="flex items-center space-x-2">
              <RadioGroupItem value={placement.value} id={placement.value} />
              <Label htmlFor={placement.value} className="font-normal cursor-pointer">
                {placement.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Placement Justification *</Label>
        <Textarea
          value={data.placementJustification || ''}
          onChange={(e) => onUpdate({ ...data, placementJustification: e.target.value })}
          placeholder="Explain why this placement is appropriate and meets the student's needs in the least restrictive environment..."
          rows={4}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">General Education Participation</h3>
        <div className="space-y-2">
          <Label>Extent of Participation in General Education *</Label>
          <Select
            value={data.generalEdParticipation || ''}
            onValueChange={(value) => onUpdate({ ...data, generalEdParticipation: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select extent of participation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time (80% or more)</SelectItem>
              <SelectItem value="majority">Majority of day (40-79%)</SelectItem>
              <SelectItem value="some">Some participation (less than 40%)</SelectItem>
              <SelectItem value="none">No participation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Explanation of General Education Participation</Label>
          <Textarea
            value={data.generalEdExplanation || ''}
            onChange={(e) => onUpdate({ ...data, generalEdExplanation: e.target.value })}
            placeholder="Describe how and when the student will participate with non-disabled peers..."
            rows={3}
          />
        </div>

        {(data.generalEdParticipation === 'some' || data.generalEdParticipation === 'none') && (
          <div className="space-y-2">
            <Label>Explanation of Any Removal from General Education</Label>
            <Textarea
              value={data.removalExplanation || ''}
              onChange={(e) => onUpdate({ ...data, removalExplanation: e.target.value })}
              placeholder="Explain why the student cannot be educated in the general education classroom with supplementary aids and services..."
              rows={3}
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">LRE Decision Factors Considered</h3>
        <div className="space-y-2">
          {LRE_FACTORS.map((factor) => (
            <div key={factor} className="flex items-center space-x-2">
              <Checkbox
                id={factor}
                checked={lreFactors.includes(factor)}
                onCheckedChange={() => toggleLREFactor(factor)}
              />
              <Label htmlFor={factor} className="font-normal cursor-pointer">
                {factor}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Additional Factors Considered</Label>
        <Textarea
          value={data.additionalFactors || ''}
          onChange={(e) => onUpdate({ ...data, additionalFactors: e.target.value })}
          placeholder="List any additional factors that influenced the placement decision..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Alternative Placements Considered</Label>
        <Textarea
          value={data.alternativePlacements || ''}
          onChange={(e) => onUpdate({ ...data, alternativePlacements: e.target.value })}
          placeholder="What other placement options were considered and why were they rejected?"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Support and Training for General Education Teachers and Staff</Label>
        <Textarea
          value={data.teacherSupport || ''}
          onChange={(e) => onUpdate({ ...data, teacherSupport: e.target.value })}
          placeholder="What training and support will general education teachers receive to support this student?"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Collaboration Model</Label>
        <Textarea
          value={data.collaborationModel || ''}
          onChange={(e) => onUpdate({ ...data, collaborationModel: e.target.value })}
          placeholder="Describe how special and general education staff will collaborate to support the student..."
          rows={2}
        />
      </div>
    </div>
  );
};
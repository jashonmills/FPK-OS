import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';

const TRANSITION_SERVICES = [
  'Instruction',
  'Related services',
  'Community experiences',
  'Development of employment and other post-school adult living objectives',
  'Daily living skills (if appropriate)',
  'Functional vocational evaluation (if appropriate)'
];

const OUTSIDE_AGENCIES = [
  'Vocational Rehabilitation Services',
  'Developmental disabilities services',
  'Mental health services',
  'Social Security Administration',
  'Department of Labor',
  'Community college disability services',
  'University disability services',
  'Independent living centers',
  'Transportation services'
];

export const TransitionPlanningStep = ({ data, onUpdate }: WizardStepProps) => {
  const jurisdiction = data.jurisdiction || 'US';
  const minAge = jurisdiction === 'US' ? 16 : 14;
  const transitionServices = data.transitionServices || [];
  const outsideAgencies = data.outsideAgencies || [];

  const toggleService = (service: string) => {
    const updated = transitionServices.includes(service)
      ? transitionServices.filter((s: string) => s !== service)
      : [...transitionServices, service];
    onUpdate({ ...data, transitionServices: updated });
  };

  const toggleAgency = (agency: string) => {
    const updated = outsideAgencies.includes(agency)
      ? outsideAgencies.filter((a: string) => a !== agency)
      : [...outsideAgencies, agency];
    onUpdate({ ...data, outsideAgencies: updated });
  };

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what={`Transition planning prepares students for life after high school (required by age ${minAge} in ${jurisdiction === 'US' ? 'US' : 'Ireland'}).`}
        why="Research shows that students with formal transition planning have better post-secondary outcomes in education, employment, and independent living."
        how="Identify measurable post-secondary goals for education/training, employment, and independent living, then specify services needed to reach those goals."
      />

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Student's Current Age</Label>
          <Input
            type="number"
            value={data.studentAge || ''}
            onChange={(e) => onUpdate({ ...data, studentAge: e.target.value })}
            placeholder="Age"
          />
        </div>
        <div>
          <Label>Expected Graduation Year</Label>
          <Input
            value={data.graduationYear || ''}
            onChange={(e) => onUpdate({ ...data, graduationYear: e.target.value })}
            placeholder="YYYY"
          />
        </div>
      </div>

      <div>
        <Label>Student's Preferences and Interests</Label>
        <Textarea
          value={data.studentPreferences || ''}
          onChange={(e) => onUpdate({ ...data, studentPreferences: e.target.value })}
          placeholder="What are the student's interests, strengths, preferences for the future?"
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Measurable Post-Secondary Goals</h3>
        
        <div className="space-y-3 border-b pb-4">
          <h4 className="font-semibold">Education/Training Goal</h4>
          <Select
            value={data.educationGoalType || ''}
            onValueChange={(value) => onUpdate({ ...data, educationGoalType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select goal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="four-year">Four-year college/university</SelectItem>
              <SelectItem value="community-college">Community college</SelectItem>
              <SelectItem value="vocational">Vocational/technical school</SelectItem>
              <SelectItem value="adult-education">Adult education programs</SelectItem>
              <SelectItem value="continuing-ed">Continuing education</SelectItem>
              <SelectItem value="na">Not applicable</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={data.educationGoal || ''}
            onChange={(e) => onUpdate({ ...data, educationGoal: e.target.value })}
            placeholder="Describe the measurable education/training goal..."
            rows={2}
          />
        </div>

        <div className="space-y-3 border-b pb-4">
          <h4 className="font-semibold">Employment Goal</h4>
          <Select
            value={data.employmentGoalType || ''}
            onValueChange={(value) => onUpdate({ ...data, employmentGoalType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select goal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="competitive">Competitive employment</SelectItem>
              <SelectItem value="supported">Supported employment</SelectItem>
              <SelectItem value="self-employment">Self-employment</SelectItem>
              <SelectItem value="sheltered">Sheltered workshop</SelectItem>
              <SelectItem value="day-program">Day program</SelectItem>
              <SelectItem value="na">Not applicable</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={data.employmentGoal || ''}
            onChange={(e) => onUpdate({ ...data, employmentGoal: e.target.value })}
            placeholder="Describe the measurable employment goal..."
            rows={2}
          />
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Independent Living Goal</h4>
          <Select
            value={data.livingGoalType || ''}
            onValueChange={(value) => onUpdate({ ...data, livingGoalType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select goal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="independent">Independent living</SelectItem>
              <SelectItem value="supported">Supported living</SelectItem>
              <SelectItem value="group-home">Group home</SelectItem>
              <SelectItem value="family">Family home</SelectItem>
              <SelectItem value="assisted">Assisted living</SelectItem>
              <SelectItem value="residential">Residential facility</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={data.livingGoal || ''}
            onChange={(e) => onUpdate({ ...data, livingGoal: e.target.value })}
            placeholder="Describe the measurable independent living goal..."
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Transition Services</h3>
        <div className="space-y-2">
          {TRANSITION_SERVICES.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={service}
                checked={transitionServices.includes(service)}
                onCheckedChange={() => toggleService(service)}
              />
              <Label htmlFor={service} className="font-normal cursor-pointer">{service}</Label>
            </div>
          ))}
        </div>
        <Textarea
          value={data.transitionServiceDetails || ''}
          onChange={(e) => onUpdate({ ...data, transitionServiceDetails: e.target.value })}
          placeholder="Describe transition services in detail..."
          rows={3}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Outside Agencies</h3>
        <div className="space-y-2">
          {OUTSIDE_AGENCIES.map((agency) => (
            <div key={agency} className="flex items-center space-x-2">
              <Checkbox
                id={agency}
                checked={outsideAgencies.includes(agency)}
                onCheckedChange={() => toggleAgency(agency)}
              />
              <Label htmlFor={agency} className="font-normal cursor-pointer">{agency}</Label>
            </div>
          ))}
        </div>
        <Textarea
          value={data.agencyResponsibilities || ''}
          onChange={(e) => onUpdate({ ...data, agencyResponsibilities: e.target.value })}
          placeholder="Describe agency responsibilities and coordination..."
          rows={2}
        />
      </div>
    </div>
  );
};
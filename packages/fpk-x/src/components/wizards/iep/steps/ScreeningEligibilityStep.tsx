import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';

const US_ELIGIBILITY_CATEGORIES = [
  'Autism',
  'Deaf-blindness',
  'Deafness',
  'Emotional disturbance',
  'Hearing impairment',
  'Intellectual disability',
  'Multiple disabilities',
  'Orthopedic impairment',
  'Other health impairment',
  'Specific learning disability',
  'Speech or language impairment',
  'Traumatic brain injury',
  'Visual impairment'
];

const IRELAND_ELIGIBILITY_CATEGORIES = [
  'Specific Learning Difficulty',
  'Autism Spectrum Disorder',
  'Emotional and Behavioural Difficulties',
  'Hearing Impairment',
  'Visual Impairment',
  'Physical Disability',
  'General Learning Difficulties',
  'Multiple Disabilities'
];

export const ScreeningEligibilityStep = ({ data, onUpdate }: WizardStepProps) => {
  const jurisdiction = data.jurisdiction || 'US';
  const eligibilityCategories = jurisdiction === 'US' ? US_ELIGIBILITY_CATEGORIES : IRELAND_ELIGIBILITY_CATEGORIES;

  const assessmentTypes = [
    { id: 'psychoeducational', label: 'Psychoeducational Assessment' },
    { id: 'speechLanguage', label: 'Speech-Language Assessment' },
    { id: 'occupationalTherapy', label: 'Occupational Therapy Assessment' },
    { id: 'physicalTherapy', label: 'Physical Therapy Assessment' }
  ];

  const handleAssessmentToggle = (assessmentId: string, checked: boolean) => {
    const assessments = data.assessments || {};
    onUpdate({
      ...data,
      assessments: {
        ...assessments,
        [assessmentId]: {
          ...assessments[assessmentId],
          completed: checked
        }
      }
    });
  };

  const handleAssessmentField = (assessmentId: string, field: string, value: string) => {
    const assessments = data.assessments || {};
    onUpdate({
      ...data,
      assessments: {
        ...assessments,
        [assessmentId]: {
          ...assessments[assessmentId],
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="This step documents formal evaluations and determines eligibility for special education services."
        why="Comprehensive assessment data provides the foundation for appropriate service determination and is legally required."
        how="Document which assessments were completed, who conducted them, and the eligibility determination based on evaluation results."
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Assessments Completed</h3>
        {assessmentTypes.map((assessment) => {
          const assessmentData = data.assessments?.[assessment.id] || {};
          const isCompleted = assessmentData.completed || false;

          return (
            <div key={assessment.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={assessment.id}
                  checked={isCompleted}
                  onCheckedChange={(checked) => handleAssessmentToggle(assessment.id, checked as boolean)}
                />
                <Label htmlFor={assessment.id} className="font-medium cursor-pointer">
                  {assessment.label}
                </Label>
              </div>

              {isCompleted && (
                <div className="ml-6 grid gap-3">
                  <div>
                    <Label>Assessment Date</Label>
                    <Input
                      type="date"
                      value={assessmentData.date || ''}
                      onChange={(e) => handleAssessmentField(assessment.id, 'date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Assessor Name</Label>
                    <Input
                      value={assessmentData.assessor || ''}
                      onChange={(e) => handleAssessmentField(assessment.id, 'assessor', e.target.value)}
                      placeholder="Name of professional who conducted assessment"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Eligibility Determination</h3>
        
        <div className="space-y-2">
          <Label>Eligibility Status *</Label>
          <Select
            value={data.eligibilityStatus || ''}
            onValueChange={(value) => onUpdate({ ...data, eligibilityStatus: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select eligibility status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eligible">Eligible</SelectItem>
              <SelectItem value="not-eligible">Not Eligible</SelectItem>
              <SelectItem value="pending">Pending Additional Assessment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.eligibilityStatus === 'eligible' && (
          <div className="space-y-2">
            <Label>Primary Eligibility Category *</Label>
            <Select
              value={data.eligibilityCategory || ''}
              onValueChange={(value) => onUpdate({ ...data, eligibilityCategory: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select primary disability category" />
              </SelectTrigger>
              <SelectContent>
                {eligibilityCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Eligibility Rationale</Label>
          <Textarea
            value={data.eligibilityRationale || ''}
            onChange={(e) => onUpdate({ ...data, eligibilityRationale: e.target.value })}
            placeholder="Explain the basis for the eligibility determination, including specific evaluation findings..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Determination Date *</Label>
          <Input
            type="date"
            value={data.determinationDate || ''}
            onChange={(e) => onUpdate({ ...data, determinationDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Evaluation Team Members</Label>
          <Textarea
            value={data.teamMembers || ''}
            onChange={(e) => onUpdate({ ...data, teamMembers: e.target.value })}
            placeholder="List all team members who participated in the evaluation and eligibility determination..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
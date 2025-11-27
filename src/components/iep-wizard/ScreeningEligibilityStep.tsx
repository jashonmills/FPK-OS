import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ScreeningEligibilityStepProps {
  data: any;
  onUpdate: (data: any) => void;
  jurisdiction: 'US_IDEA' | 'IE_EPSEN';
}

export function ScreeningEligibilityStep({ data, onUpdate, jurisdiction }: ScreeningEligibilityStepProps) {
  const updateData = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const eligibilityCategories = jurisdiction === 'US_IDEA' ? [
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
  ] : [
    'Specific Learning Difficulty',
    'Autism Spectrum Disorder',
    'Emotional and Behavioural Difficulties',
    'Hearing Impairment',
    'Visual Impairment',
    'Physical Disability',
    'General Learning Difficulties',
    'Multiple Disabilities'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Formal Evaluations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="psychoeducational">Psychoeducational Assessment</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="psychoeducational"
                  checked={data.psychoeducational?.completed || false}
                  onCheckedChange={(checked) => 
                    updateData('psychoeducational', { ...data.psychoeducational, completed: checked })
                  }
                />
                <span>Completed</span>
              </div>
              {data.psychoeducational?.completed && (
                <div className="mt-2 space-y-2">
                  <Input
                    placeholder="Assessment date"
                    type="date"
                    value={data.psychoeducational?.date || ''}
                    onChange={(e) => 
                      updateData('psychoeducational', { ...data.psychoeducational, date: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Assessor name"
                    value={data.psychoeducational?.assessor || ''}
                    onChange={(e) => 
                      updateData('psychoeducational', { ...data.psychoeducational, assessor: e.target.value })
                    }
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="speech-language">Speech-Language Assessment</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="speech-language"
                  checked={data.speechLanguage?.completed || false}
                  onCheckedChange={(checked) => 
                    updateData('speechLanguage', { ...data.speechLanguage, completed: checked })
                  }
                />
                <span>Completed</span>
              </div>
              {data.speechLanguage?.completed && (
                <div className="mt-2 space-y-2">
                  <Input
                    placeholder="Assessment date"
                    type="date"
                    value={data.speechLanguage?.date || ''}
                    onChange={(e) => 
                      updateData('speechLanguage', { ...data.speechLanguage, date: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Assessor name"
                    value={data.speechLanguage?.assessor || ''}
                    onChange={(e) => 
                      updateData('speechLanguage', { ...data.speechLanguage, assessor: e.target.value })
                    }
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="occupational">Occupational Therapy Assessment</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="occupational"
                  checked={data.occupationalTherapy?.completed || false}
                  onCheckedChange={(checked) => 
                    updateData('occupationalTherapy', { ...data.occupationalTherapy, completed: checked })
                  }
                />
                <span>Completed</span>
              </div>
              {data.occupationalTherapy?.completed && (
                <div className="mt-2 space-y-2">
                  <Input
                    placeholder="Assessment date"
                    type="date"
                    value={data.occupationalTherapy?.date || ''}
                    onChange={(e) => 
                      updateData('occupationalTherapy', { ...data.occupationalTherapy, date: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Assessor name"
                    value={data.occupationalTherapy?.assessor || ''}
                    onChange={(e) => 
                      updateData('occupationalTherapy', { ...data.occupationalTherapy, assessor: e.target.value })
                    }
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="physical">Physical Therapy Assessment</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="physical"
                  checked={data.physicalTherapy?.completed || false}
                  onCheckedChange={(checked) => 
                    updateData('physicalTherapy', { ...data.physicalTherapy, completed: checked })
                  }
                />
                <span>Completed</span>
              </div>
              {data.physicalTherapy?.completed && (
                <div className="mt-2 space-y-2">
                  <Input
                    placeholder="Assessment date"
                    type="date"
                    value={data.physicalTherapy?.date || ''}
                    onChange={(e) => 
                      updateData('physicalTherapy', { ...data.physicalTherapy, date: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Assessor name"
                    value={data.physicalTherapy?.assessor || ''}
                    onChange={(e) => 
                      updateData('physicalTherapy', { ...data.physicalTherapy, assessor: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eligibility Determination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="eligibility-status">Eligibility Status</Label>
            <Select
              value={data.eligibilityStatus || ''}
              onValueChange={(value) => updateData('eligibilityStatus', value)}
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
            <div>
              <Label htmlFor="primary-category">Primary Eligibility Category</Label>
              <Select
                value={data.primaryCategory || ''}
                onValueChange={(value) => updateData('primaryCategory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select primary category" />
                </SelectTrigger>
                <SelectContent>
                  {eligibilityCategories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="eligibility-rationale">Eligibility Rationale</Label>
            <Textarea
              id="eligibility-rationale"
              placeholder="Provide detailed rationale for eligibility determination..."
              value={data.eligibilityRationale || ''}
              onChange={(e) => updateData('eligibilityRationale', e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="determination-date">Determination Date</Label>
            <Input
              id="determination-date"
              type="date"
              value={data.determinationDate || ''}
              onChange={(e) => updateData('determinationDate', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="team-members">Evaluation Team Members</Label>
            <Textarea
              id="team-members"
              placeholder="List all team members who participated in the evaluation process..."
              value={data.teamMembers || ''}
              onChange={(e) => updateData('teamMembers', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
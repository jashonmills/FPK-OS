import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AssessmentParticipationStepProps {
  data: any;
  onUpdate: (data: any) => void;
  jurisdiction: 'US_IDEA' | 'IE_EPSEN';
}

export function AssessmentParticipationStep({ data, onUpdate, jurisdiction }: AssessmentParticipationStepProps) {
  const updateData = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const assessments = jurisdiction === 'US_IDEA' ? [
    {
      name: 'State Academic Assessments',
      key: 'stateAcademic',
      subjects: ['English Language Arts', 'Mathematics', 'Science', 'Social Studies']
    },
    {
      name: 'English Language Proficiency Assessment',
      key: 'englishProficiency',
      subjects: ['English Language Proficiency']
    },
    {
      name: 'National Assessment of Educational Progress (NAEP)',
      key: 'naep',
      subjects: ['Various subjects as selected']
    }
  ] : [
    {
      name: 'Junior Certificate Examination',
      key: 'juniorCert',
      subjects: ['Irish', 'English', 'Mathematics', 'Science', 'History', 'Geography', 'Other subjects']
    },
    {
      name: 'Leaving Certificate Examination',
      key: 'leavingCert',
      subjects: ['Irish', 'English', 'Mathematics', 'Other subjects']
    },
    {
      name: 'Certificate of Completion',
      key: 'completion',
      subjects: ['Alternative certification']
    }
  ];

  const accommodationCategories = [
    {
      name: 'Presentation Accommodations',
      key: 'presentation',
      options: [
        'Large print',
        'Braille',
        'Audio presentation',
        'Sign language interpretation',
        'Magnification devices',
        'Simplified language',
        'Visual cues'
      ]
    },
    {
      name: 'Response Accommodations',
      key: 'response',
      options: [
        'Computer for writing',
        'Scribe',
        'Speech-to-text software',
        'Calculator',
        'Spell check',
        'Grammar check',
        'Word processor'
      ]
    },
    {
      name: 'Timing and Scheduling',
      key: 'timing',
      options: [
        'Extended time (1.5x)',
        'Extended time (2x)',
        'Multiple sessions',
        'Flexible scheduling',
        'Time of day',
        'Frequent breaks'
      ]
    },
    {
      name: 'Setting Accommodations',
      key: 'setting',
      options: [
        'Separate room',
        'Small group setting',
        'Individual administration',
        'Hospital/homebound',
        'Familiar test administrator',
        'Quiet environment'
      ]
    }
  ];

  const toggleAccommodation = (category: string, accommodation: string) => {
    const categoryData = data[category] || [];
    const updated = categoryData.includes(accommodation)
      ? categoryData.filter((a: string) => a !== accommodation)
      : [...categoryData, accommodation];
    updateData(category, updated);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assessment Participation Decision</CardTitle>
          <p className="text-sm text-muted-foreground">
            Determine how the student will participate in {jurisdiction === 'US_IDEA' ? 'state and district-wide' : 'national'} assessments
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {assessments.map((assessment) => (
            <div key={assessment.key} className="border rounded-lg p-4 space-y-4">
              <h4 className="font-medium">{assessment.name}</h4>
              
              <div>
                <Label>Participation Method</Label>
                <RadioGroup
                  value={data[`${assessment.key}Participation`] || ''}
                  onValueChange={(value) => updateData(`${assessment.key}Participation`, value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id={`${assessment.key}-standard`} />
                    <Label htmlFor={`${assessment.key}-standard`}>
                      Standard assessment (with or without accommodations)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alternate" id={`${assessment.key}-alternate`} />
                    <Label htmlFor={`${assessment.key}-alternate`}>
                      Alternate assessment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exempt" id={`${assessment.key}-exempt`} />
                    <Label htmlFor={`${assessment.key}-exempt`}>
                      Exempt from assessment
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {data[`${assessment.key}Participation`] === 'alternate' && (
                <div>
                  <Label htmlFor={`${assessment.key}-alternate-rationale`}>
                    Rationale for Alternate Assessment
                  </Label>
                  <Textarea
                    id={`${assessment.key}-alternate-rationale`}
                    placeholder="Explain why the student cannot participate in the standard assessment even with accommodations..."
                    value={data[`${assessment.key}AlternateRationale`] || ''}
                    onChange={(e) => updateData(`${assessment.key}AlternateRationale`, e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {data[`${assessment.key}Participation`] === 'exempt' && (
                <div>
                  <Label htmlFor={`${assessment.key}-exempt-rationale`}>
                    Rationale for Exemption
                  </Label>
                  <Textarea
                    id={`${assessment.key}-exempt-rationale`}
                    placeholder="Explain why the student is exempt from this assessment..."
                    value={data[`${assessment.key}ExemptRationale`] || ''}
                    onChange={(e) => updateData(`${assessment.key}ExemptRationale`, e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              <div>
                <Label>Subjects/Areas</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {assessment.subjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${assessment.key}-${subject}`}
                        checked={(data[`${assessment.key}Subjects`] || []).includes(subject)}
                        onCheckedChange={(checked) => {
                          const current = data[`${assessment.key}Subjects`] || [];
                          const updated = checked
                            ? [...current, subject]
                            : current.filter((s: string) => s !== subject);
                          updateData(`${assessment.key}Subjects`, updated);
                        }}
                      />
                      <Label
                        htmlFor={`${assessment.key}-${subject}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Accommodations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select accommodations that the student will receive during assessments
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {accommodationCategories.map((category) => (
            <div key={category.key} className="space-y-3">
              <h4 className="font-medium">{category.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${category.key}-${option}`}
                      checked={(data[category.key] || []).includes(option)}
                      onCheckedChange={() => toggleAccommodation(category.key, option)}
                    />
                    <Label
                      htmlFor={`${category.key}-${option}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div>
            <Label htmlFor="additional-accommodations">Additional Accommodations</Label>
            <Textarea
              id="additional-accommodations"
              placeholder="Describe any additional accommodations not listed above..."
              value={data.additionalAccommodations || ''}
              onChange={(e) => updateData('additionalAccommodations', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Schedule and Logistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="assessment-schedule">Assessment Schedule</Label>
            <Textarea
              id="assessment-schedule"
              placeholder="Describe when and how often the student will participate in assessments..."
              value={data.assessmentSchedule || ''}
              onChange={(e) => updateData('assessmentSchedule', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="test-administrator">Designated Test Administrator</Label>
            <Textarea
              id="test-administrator"
              placeholder="Specify who will administer assessments to this student..."
              value={data.testAdministrator || ''}
              onChange={(e) => updateData('testAdministrator', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="progress-reporting">Progress Reporting</Label>
            <Textarea
              id="progress-reporting"
              placeholder="Describe how assessment results will be reported to parents..."
              value={data.progressReporting || ''}
              onChange={(e) => updateData('progressReporting', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
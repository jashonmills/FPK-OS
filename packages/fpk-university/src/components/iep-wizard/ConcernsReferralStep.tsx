import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConcernsReferralStepProps {
  data: any;
  onUpdate: (data: any) => void;
  jurisdiction: 'US_IDEA' | 'IE_EPSEN';
}

export function ConcernsReferralStep({ data, onUpdate, jurisdiction }: ConcernsReferralStepProps) {
  const updateData = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const concernAreas = [
    'Academic Performance',
    'Communication/Language',
    'Social/Emotional Behavior', 
    'Physical/Motor Skills',
    'Attention/Focus',
    'Memory',
    'Executive Functioning',
    'Sensory Processing',
    'Transition Difficulties',
    'Peer Relationships',
    'Self-Regulation',
    'Adaptive Behavior'
  ];

  const referralSources = [
    'Parent/Guardian',
    'General Education Teacher',
    'Special Education Teacher',
    'School Counselor',
    'School Psychologist',
    'Principal/Administrator',
    'Related Service Provider',
    'Medical Professional',
    'Previous School',
    'Child Study Team',
    'Self-Referral (Student)',
    'Other'
  ];

  const toggleConcernArea = (area: string) => {
    const current = data.concernAreas || [];
    const updated = current.includes(area)
      ? current.filter((a: string) => a !== area)
      : [...current, area];
    updateData('concernAreas', updated);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Primary Concerns</CardTitle>
          <p className="text-sm text-muted-foreground">
            Identify the main areas of concern that led to this referral
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Areas of Concern</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {concernAreas.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={`concern-${area}`}
                    checked={(data.concernAreas || []).includes(area)}
                    onCheckedChange={() => toggleConcernArea(area)}
                  />
                  <Label 
                    htmlFor={`concern-${area}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {area}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="primaryConcerns">Detailed Description of Primary Concerns</Label>
            <Textarea
              id="primaryConcerns"
              placeholder="Provide a detailed description of the primary concerns about the student's educational performance..."
              value={data.primaryConcerns || ''}
              onChange={(e) => updateData('primaryConcerns', e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="specificExamples">Specific Examples or Incidents</Label>
            <Textarea
              id="specificExamples"
              placeholder="Describe specific examples, incidents, or behaviors that illustrate the concerns..."
              value={data.specificExamples || ''}
              onChange={(e) => updateData('specificExamples', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="referralSource">Referral Source</Label>
              <Select
                value={data.referralSource || ''}
                onValueChange={(value) => updateData('referralSource', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Who made the referral?" />
                </SelectTrigger>
                <SelectContent>
                  {referralSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="referralDate">Date of Referral</Label>
              <Input
                id="referralDate"
                type="date"
                value={data.referralDate || ''}
                onChange={(e) => updateData('referralDate', e.target.value)}
              />
            </div>
          </div>

          {data.referralSource === 'Other' && (
            <div>
              <Label htmlFor="otherReferralSource">Please specify other referral source</Label>
              <Input
                id="otherReferralSource"
                placeholder="Specify the referral source"
                value={data.otherReferralSource || ''}
                onChange={(e) => updateData('otherReferralSource', e.target.value)}
              />
            </div>
          )}

          <div>
            <Label htmlFor="referralReason">Reason for Referral</Label>
            <Textarea
              id="referralReason"
              placeholder="Why was the student referred for special education evaluation?"
              value={data.referralReason || ''}
              onChange={(e) => updateData('referralReason', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous Interventions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="previousInterventions">Previous Interventions Attempted</Label>
            <Textarea
              id="previousInterventions"
              placeholder="Describe any interventions, accommodations, or support strategies that have been tried..."
              value={data.previousInterventions || ''}
              onChange={(e) => updateData('previousInterventions', e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="interventionOutcomes">Outcomes of Previous Interventions</Label>
            <Textarea
              id="interventionOutcomes"
              placeholder="What were the results or effectiveness of the interventions that were tried?"
              value={data.interventionOutcomes || ''}
              onChange={(e) => updateData('interventionOutcomes', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="interventionDuration">Duration of Interventions</Label>
            <Input
              id="interventionDuration"
              placeholder="How long were interventions implemented? (e.g., 6 weeks, 3 months)"
              value={data.interventionDuration || ''}
              onChange={(e) => updateData('interventionDuration', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environmental Factors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="homeFactors">Home Environment Factors</Label>
            <Textarea
              id="homeFactors"
              placeholder="Describe any relevant home environment factors that may impact learning..."
              value={data.homeFactors || ''}
              onChange={(e) => updateData('homeFactors', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="schoolFactors">School Environment Factors</Label>
            <Textarea
              id="schoolFactors"
              placeholder="Describe any relevant school environment factors that may impact learning..."
              value={data.schoolFactors || ''}
              onChange={(e) => updateData('schoolFactors', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="culturalFactors">Cultural or Linguistic Factors</Label>
            <Textarea
              id="culturalFactors"
              placeholder="Describe any cultural, linguistic, or socioeconomic factors that should be considered..."
              value={data.culturalFactors || ''}
              onChange={(e) => updateData('culturalFactors', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentGrades">Current Academic Performance/Grades</Label>
            <Textarea
              id="currentGrades"
              placeholder="Describe the student's current academic performance across subject areas..."
              value={data.currentGrades || ''}
              onChange={(e) => updateData('currentGrades', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="teacherObservations">Teacher Observations</Label>
            <Textarea
              id="teacherObservations"
              placeholder="What have teachers observed about the student's performance, behavior, and learning needs?"
              value={data.teacherObservations || ''}
              onChange={(e) => updateData('teacherObservations', e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="studentStrengths">Student Strengths and Interests</Label>
            <Textarea
              id="studentStrengths"
              placeholder="What are the student's strengths, talents, and areas of interest?"
              value={data.studentStrengths || ''}
              onChange={(e) => updateData('studentStrengths', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface TransitionPlanningStepProps {
  data: any;
  onUpdate: (data: any) => void;
  jurisdiction: 'US_IDEA' | 'IE_EPSEN';
}

export function TransitionPlanningStep({ data, onUpdate, jurisdiction }: TransitionPlanningStepProps) {
  const updateData = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const transitionAges = jurisdiction === 'US_IDEA' 
    ? { start: 16, label: 'age 16 (or younger if appropriate)' }
    : { start: 14, label: 'Junior Cycle (typically age 14-15)' };

  const postSecondaryGoals = {
    education: [
      'Four-year college/university',
      'Community college',
      'Vocational/technical school',
      'Adult education programs',
      'Continuing education',
      'Not applicable'
    ],
    employment: [
      'Competitive employment',
      'Supported employment',
      'Self-employment',
      'Sheltered workshop',
      'Day program',
      'Not applicable'
    ],
    living: [
      'Independent living',
      'Supported living',
      'Group home',
      'Family home',
      'Assisted living',
      'Residential facility'
    ]
  };

  const transitionServices = [
    'Instruction',
    'Related services',
    'Community experiences',
    'Development of employment and other post-school adult living objectives',
    'Daily living skills (if appropriate)',
    'Functional vocational evaluation (if appropriate)'
  ];

  const agencies = [
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

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Transition planning is required beginning at {transitionAges.label}. 
          This section should be completed for students who meet the age requirement.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student-age">Student's Current Age</Label>
              <Input
                id="student-age"
                type="number"
                placeholder="Age"
                value={data.studentAge || ''}
                onChange={(e) => updateData('studentAge', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="graduation-year">Expected Graduation Year</Label>
              <Input
                id="graduation-year"
                type="number"
                placeholder="YYYY"
                value={data.graduationYear || ''}
                onChange={(e) => updateData('graduationYear', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="student-preferences">Student's Preferences and Interests</Label>
            <Textarea
              id="student-preferences"
              placeholder="Describe the student's preferences, interests, and strengths related to post-secondary goals..."
              value={data.studentPreferences || ''}
              onChange={(e) => updateData('studentPreferences', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Measurable Post-Secondary Goals</CardTitle>
          <p className="text-sm text-muted-foreground">
            Goals should be measurable and based on age-appropriate transition assessments
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="education-goal">Education/Training Goal</Label>
            <Select
              value={data.educationGoalType || ''}
              onValueChange={(value) => updateData('educationGoalType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select education goal type" />
              </SelectTrigger>
              <SelectContent>
                {postSecondaryGoals.education.map((goal) => (
                  <SelectItem key={goal} value={goal.toLowerCase().replace(/\s+/g, '-')}>
                    {goal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              className="mt-2"
              placeholder="After graduation, [student] will..."
              value={data.educationGoal || ''}
              onChange={(e) => updateData('educationGoal', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="employment-goal">Employment Goal</Label>
            <Select
              value={data.employmentGoalType || ''}
              onValueChange={(value) => updateData('employmentGoalType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment goal type" />
              </SelectTrigger>
              <SelectContent>
                {postSecondaryGoals.employment.map((goal) => (
                  <SelectItem key={goal} value={goal.toLowerCase().replace(/\s+/g, '-')}>
                    {goal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              className="mt-2"
              placeholder="After graduation, [student] will..."
              value={data.employmentGoal || ''}
              onChange={(e) => updateData('employmentGoal', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="living-goal">Independent Living Goal</Label>
            <Select
              value={data.livingGoalType || ''}
              onValueChange={(value) => updateData('livingGoalType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select living arrangement goal" />
              </SelectTrigger>
              <SelectContent>
                {postSecondaryGoals.living.map((goal) => (
                  <SelectItem key={goal} value={goal.toLowerCase().replace(/\s+/g, '-')}>
                    {goal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              className="mt-2"
              placeholder="After graduation, [student] will..."
              value={data.livingGoal || ''}
              onChange={(e) => updateData('livingGoal', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transition Services</CardTitle>
          <p className="text-sm text-muted-foreground">
            Coordinated set of activities designed to facilitate movement from school to post-school activities
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Required Transition Services</Label>
            <div className="grid grid-cols-1 gap-3 mt-3">
              {transitionServices.map((service) => (
                <div key={service} className="flex items-start space-x-2">
                  <Checkbox
                    id={`service-${service}`}
                    checked={(data.transitionServices || []).includes(service)}
                    onCheckedChange={(checked) => {
                      const current = data.transitionServices || [];
                      const updated = checked
                        ? [...current, service]
                        : current.filter((s: string) => s !== service);
                      updateData('transitionServices', updated);
                    }}
                  />
                  <Label
                    htmlFor={`service-${service}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {service}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="service-details">Transition Service Details</Label>
            <Textarea
              id="service-details"
              placeholder="Describe the specific transition services that will be provided, including who will provide them and when..."
              value={data.serviceDetails || ''}
              onChange={(e) => updateData('serviceDetails', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Annual IEP Goals Related to Transition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="transition-goals">
              IEP Goals That Support Transition to Post-Secondary Goals
            </Label>
            <Textarea
              id="transition-goals"
              placeholder="List the IEP goals that will help the student achieve their post-secondary goals..."
              value={data.transitionGoals || ''}
              onChange={(e) => updateData('transitionGoals', e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="courses-of-study">Courses of Study</Label>
            <Textarea
              id="courses-of-study"
              placeholder="Describe the courses of study that will help the student reach their post-secondary goals..."
              value={data.coursesOfStudy || ''}
              onChange={(e) => updateData('coursesOfStudy', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agency Linkages and Responsibilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Outside Agencies</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {agencies.map((agency) => (
                <div key={agency} className="flex items-center space-x-2">
                  <Checkbox
                    id={`agency-${agency}`}
                    checked={(data.outsideAgencies || []).includes(agency)}
                    onCheckedChange={(checked) => {
                      const current = data.outsideAgencies || [];
                      const updated = checked
                        ? [...current, agency]
                        : current.filter((a: string) => a !== agency);
                      updateData('outsideAgencies', updated);
                    }}
                  />
                  <Label
                    htmlFor={`agency-${agency}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {agency}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="agency-responsibilities">Agency Responsibilities</Label>
            <Textarea
              id="agency-responsibilities"
              placeholder="Describe the specific responsibilities of each outside agency..."
              value={data.agencyResponsibilities || ''}
              onChange={(e) => updateData('agencyResponsibilities', e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="consent-status">
              Student Consent Status (Required at age of majority)
            </Label>
            <Select
              value={data.consentStatus || ''}
              onValueChange={(value) => updateData('consentStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select consent status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-applicable">Not applicable (under age of majority)</SelectItem>
                <SelectItem value="consented">Student has consented to agency participation</SelectItem>
                <SelectItem value="refused">Student has refused agency participation</SelectItem>
                <SelectItem value="pending">Consent pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
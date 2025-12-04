import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ParentStudentInputStepProps {
  data: any;
  onUpdate: (data: any) => void;
  jurisdiction: 'US_IDEA' | 'IE_EPSEN';
}

export function ParentStudentInputStep({ data, onUpdate, jurisdiction }: ParentStudentInputStepProps) {
  const updateData = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const priorityAreas = [
    'Academic achievement',
    'Communication skills',
    'Social skills development',
    'Behavioral support',
    'Independence/life skills',
    'Physical/motor skills',
    'Vocational preparation',
    'Transition planning',
    'Technology skills',
    'Recreation/leisure activities'
  ];

  const communicationMethods = [
    'In-person meetings',
    'Phone calls',
    'Email',
    'Text messages',
    'Communication notebook',
    'School app/portal',
    'Written reports',
    'Video calls'
  ];

  const participationBarriers = [
    'Work schedule conflicts',
    'Transportation issues',
    'Language barriers',
    'Childcare needs',
    'Health issues',
    'Lack of information',
    'Previous negative experiences',
    'Cultural differences'
  ];

  const togglePriority = (priority: string) => {
    const current = data.familyPriorities || [];
    const updated = current.includes(priority)
      ? current.filter((p: string) => p !== priority)
      : [...current, priority];
    updateData('familyPriorities', updated);
  };

  const toggleCommunicationMethod = (method: string) => {
    const current = data.communicationMethods || [];
    const updated = current.includes(method)
      ? current.filter((m: string) => m !== method)
      : [...current, method];
    updateData('communicationMethods', updated);
  };

  const toggleBarrier = (barrier: string) => {
    const current = data.participationBarriers || [];
    const updated = current.includes(barrier)
      ? current.filter((b: string) => b !== barrier)
      : [...current, barrier];
    updateData('participationBarriers', updated);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Family Vision and Priorities</CardTitle>
          <p className="text-sm text-muted-foreground">
            Capture the family's hopes, dreams, and priorities for their child
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="family-vision">Family Vision for the Student</Label>
            <Textarea
              id="family-vision"
              placeholder="What does the family hope to see for their child in the future? What are their dreams and aspirations?"
              value={data.familyVision || ''}
              onChange={(e) => updateData('familyVision', e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label>Priority Areas for Development</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {priorityAreas.map((priority) => (
                <div key={priority} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${priority}`}
                    checked={(data.familyPriorities || []).includes(priority)}
                    onCheckedChange={() => togglePriority(priority)}
                  />
                  <Label
                    htmlFor={`priority-${priority}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {priority}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="additional-priorities">Additional Family Priorities</Label>
            <Textarea
              id="additional-priorities"
              placeholder="Describe any additional priorities or concerns not listed above..."
              value={data.additionalPriorities || ''}
              onChange={(e) => updateData('additionalPriorities', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="family-concerns">Family Concerns</Label>
            <Textarea
              id="family-concerns"
              placeholder="What concerns does the family have about their child's education and development?"
              value={data.familyConcerns || ''}
              onChange={(e) => updateData('familyConcerns', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Voice and Preferences</CardTitle>
          <p className="text-sm text-muted-foreground">
            Include the student's own perspectives and preferences
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="student-age-check">Is the student age-appropriate to provide input?</Label>
            <Select
              value={data.studentInputAppropriate || ''}
              onValueChange={(value) => updateData('studentInputAppropriate', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No (too young or unable)</SelectItem>
                <SelectItem value="limited">Limited input possible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(data.studentInputAppropriate === 'yes' || data.studentInputAppropriate === 'limited') && (
            <>
              <div>
                <Label htmlFor="student-interests">Student's Interests and Preferences</Label>
                <Textarea
                  id="student-interests"
                  placeholder="What does the student enjoy? What are their interests and hobbies?"
                  value={data.studentInterests || ''}
                  onChange={(e) => updateData('studentInterests', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="student-goals">Student's Personal Goals</Label>
                <Textarea
                  id="student-goals"
                  placeholder="What does the student want to achieve? What are their personal goals?"
                  value={data.studentGoals || ''}
                  onChange={(e) => updateData('studentGoals', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="student-concerns">Student's Concerns</Label>
                <Textarea
                  id="student-concerns"
                  placeholder="What concerns does the student have about school or their future?"
                  value={data.studentConcerns || ''}
                  onChange={(e) => updateData('studentConcerns', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="learning-preferences">Learning Preferences</Label>
                <Textarea
                  id="learning-preferences"
                  placeholder="How does the student learn best? What teaching methods work well for them?"
                  value={data.learningPreferences || ''}
                  onChange={(e) => updateData('learningPreferences', e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Home and Community Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="home-strengths">Strengths at Home and in Community</Label>
            <Textarea
              id="home-strengths"
              placeholder="What does the student do well at home and in the community?"
              value={data.homeStrengths || ''}
              onChange={(e) => updateData('homeStrengths', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="home-challenges">Challenges at Home and in Community</Label>
            <Textarea
              id="home-challenges"
              placeholder="What challenges does the student face at home and in the community?"
              value={data.homeChallenges || ''}
              onChange={(e) => updateData('homeChallenges', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="cultural-considerations">Cultural and Linguistic Considerations</Label>
            <Textarea
              id="cultural-considerations"
              placeholder="Are there cultural, linguistic, or religious considerations that should inform the IEP?"
              value={data.culturalConsiderations || ''}
              onChange={(e) => updateData('culturalConsiderations', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="family-resources">Family Resources and Support Systems</Label>
            <Textarea
              id="family-resources"
              placeholder="What resources and support systems does the family have available?"
              value={data.familyResources || ''}
              onChange={(e) => updateData('familyResources', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communication and Collaboration Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Preferred Communication Methods</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {communicationMethods.map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={`comm-${method}`}
                    checked={(data.communicationMethods || []).includes(method)}
                    onCheckedChange={() => toggleCommunicationMethod(method)}
                  />
                  <Label
                    htmlFor={`comm-${method}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {method}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="communication-frequency">Preferred Communication Frequency</Label>
            <Select
              value={data.communicationFrequency || ''}
              onValueChange={(value) => updateData('communicationFrequency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="as-needed">As needed</SelectItem>
                <SelectItem value="progress-reports">Progress report periods</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="meeting-preferences">Meeting Preferences</Label>
            <Textarea
              id="meeting-preferences"
              placeholder="What are the family's preferences for IEP meetings (timing, format, etc.)?"
              value={data.meetingPreferences || ''}
              onChange={(e) => updateData('meetingPreferences', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participation Support Needs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Barriers to Family Participation</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {participationBarriers.map((barrier) => (
                <div key={barrier} className="flex items-center space-x-2">
                  <Checkbox
                    id={`barrier-${barrier}`}
                    checked={(data.participationBarriers || []).includes(barrier)}
                    onCheckedChange={() => toggleBarrier(barrier)}
                  />
                  <Label
                    htmlFor={`barrier-${barrier}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {barrier}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="support-needed">Support Needed for Participation</Label>
            <Textarea
              id="support-needed"
              placeholder="What support does the family need to participate fully in their child's education?"
              value={data.supportNeeded || ''}
              onChange={(e) => updateData('supportNeeded', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="interpreter-needed">Interpreter Services</Label>
            <Select
              value={data.interpreterNeeded || ''}
              onValueChange={(value) => updateData('interpreterNeeded', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select if interpreter needed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No interpreter needed</SelectItem>
                <SelectItem value="sign-language">Sign language interpreter</SelectItem>
                <SelectItem value="spoken-language">Spoken language interpreter</SelectItem>
                <SelectItem value="both">Both sign and spoken language</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.interpreterNeeded !== 'none' && data.interpreterNeeded && (
            <div>
              <Label htmlFor="interpreter-language">Language/Type Needed</Label>
              <Input
                id="interpreter-language"
                placeholder="Specify the language or type of interpretation needed"
                value={data.interpreterLanguage || ''}
                onChange={(e) => updateData('interpreterLanguage', e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
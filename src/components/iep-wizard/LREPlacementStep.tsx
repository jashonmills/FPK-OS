import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface LREPlacementStepProps {
  data: any;
  onUpdate: (data: any) => void;
  jurisdiction: 'US_IDEA' | 'IE_EPSEN';
}

export function LREPlacementStep({ data, onUpdate, jurisdiction }: LREPlacementStepProps) {
  const updateData = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const placementOptions = jurisdiction === 'US_IDEA' ? [
    {
      value: 'general-education',
      label: 'General Education Classroom',
      description: 'Student receives all services in general education setting'
    },
    {
      value: 'resource-room',
      label: 'Resource Room',
      description: 'Student receives services in resource room for part of the day'
    },
    {
      value: 'special-class',
      label: 'Special Education Class',
      description: 'Student is in special education class for most of the day'
    },
    {
      value: 'separate-school',
      label: 'Separate School',
      description: 'Student attends a separate special education school'
    },
    {
      value: 'residential',
      label: 'Residential Facility',
      description: 'Student receives services in a residential setting'
    },
    {
      value: 'homebound',
      label: 'Homebound/Hospital',
      description: 'Student receives services at home or in hospital'
    }
  ] : [
    {
      value: 'mainstream',
      label: 'Mainstream Class',
      description: 'Student fully included in mainstream classroom'
    },
    {
      value: 'mainstream-support',
      label: 'Mainstream with Support',
      description: 'Student in mainstream with SNA or resource support'
    },
    {
      value: 'special-class',
      label: 'Special Class',
      description: 'Student in special class within mainstream school'
    },
    {
      value: 'special-school',
      label: 'Special School',
      description: 'Student attends a special school'
    },
    {
      value: 'home-tuition',
      label: 'Home Tuition',
      description: 'Student receives education at home'
    }
  ];

  const factors = [
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {jurisdiction === 'US_IDEA' 
              ? 'Least Restrictive Environment (LRE) Determination'
              : 'Continuum of Support and Placement'
            }
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {jurisdiction === 'US_IDEA'
              ? 'Determine the most appropriate educational setting that provides FAPE in the LRE'
              : 'Determine appropriate support level and educational placement'
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-placement">Current Educational Placement</Label>
            <RadioGroup
              value={data.currentPlacement || ''}
              onValueChange={(value) => updateData('currentPlacement', value)}
            >
              {placementOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="space-y-1">
                    <Label htmlFor={option.value} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="placement-justification">Placement Justification</Label>
            <Textarea
              id="placement-justification"
              placeholder="Explain why this placement is appropriate and represents the LRE for this student..."
              value={data.placementJustification || ''}
              onChange={(e) => updateData('placementJustification', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>General Education Participation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="gen-ed-participation">
              Extent of Participation in General Education
            </Label>
            <Select
              value={data.genEdParticipation || ''}
              onValueChange={(value) => updateData('genEdParticipation', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select participation level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time (80% or more)</SelectItem>
                <SelectItem value="majority">Majority of day (40-79%)</SelectItem>
                <SelectItem value="some">Some participation (less than 40%)</SelectItem>
                <SelectItem value="none">No participation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="gen-ed-explanation">
              Explanation of General Education Participation
            </Label>
            <Textarea
              id="gen-ed-explanation"
              placeholder="Describe the specific general education classes/activities the student will participate in..."
              value={data.genEdExplanation || ''}
              onChange={(e) => updateData('genEdExplanation', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="removal-explanation">
              Explanation of Any Removal from General Education
            </Label>
            <Textarea
              id="removal-explanation"
              placeholder="If the student will be removed from general education for any period, explain why removal is necessary..."
              value={data.removalExplanation || ''}
              onChange={(e) => updateData('removalExplanation', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {jurisdiction === 'US_IDEA' ? 'LRE Decision Factors' : 'Placement Decision Factors'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Factors Considered in Placement Decision</Label>
            <div className="grid grid-cols-1 gap-3 mt-3">
              {factors.map((factor) => (
                <div key={factor} className="flex items-center space-x-2">
                  <Checkbox
                    id={`factor-${factor}`}
                    checked={(data.considerationFactors || []).includes(factor)}
                    onCheckedChange={(checked) => {
                      const current = data.considerationFactors || [];
                      const updated = checked
                        ? [...current, factor]
                        : current.filter((f: string) => f !== factor);
                      updateData('considerationFactors', updated);
                    }}
                  />
                  <Label
                    htmlFor={`factor-${factor}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {factor}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="additional-factors">Additional Factors Considered</Label>
            <Textarea
              id="additional-factors"
              placeholder="Describe any additional factors that were considered in making this placement decision..."
              value={data.additionalFactors || ''}
              onChange={(e) => updateData('additionalFactors', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="alternatives-considered">Alternative Placements Considered</Label>
            <Textarea
              id="alternatives-considered"
              placeholder="List and explain why other placement options were rejected..."
              value={data.alternativesConsidered || ''}
              onChange={(e) => updateData('alternativesConsidered', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support for School Personnel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="staff-support">
              Support and Training for General Education Teachers and Staff
            </Label>
            <Textarea
              id="staff-support"
              placeholder="Describe the support, training, or professional development that will be provided to general education teachers and other staff..."
              value={data.staffSupport || ''}
              onChange={(e) => updateData('staffSupport', e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="collaboration-model">Collaboration Model</Label>
            <Textarea
              id="collaboration-model"
              placeholder="Describe how special education and general education staff will collaborate..."
              value={data.collaborationModel || ''}
              onChange={(e) => updateData('collaborationModel', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
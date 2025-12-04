import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PresentLevelsStepProps {
  data: any;
  onUpdate: (data: any) => void;
  jurisdiction: 'US_IDEA' | 'IE_EPSEN';
}

export function PresentLevelsStep({ data, onUpdate, jurisdiction }: PresentLevelsStepProps) {
  const updateData = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const performanceLevels = [
    'Significantly Below Grade Level',
    'Below Grade Level',
    'Approaching Grade Level',
    'At Grade Level',
    'Above Grade Level'
  ];

  const domains = [
    {
      key: 'academic',
      title: 'Academic Performance',
      areas: ['Reading', 'Writing', 'Mathematics', 'Science', 'Social Studies']
    },
    {
      key: 'functional',
      title: 'Functional Performance',
      areas: ['Communication', 'Social Skills', 'Behavior', 'Self Care', 'Motor Skills']
    },
    {
      key: 'cognitive',
      title: 'Cognitive Processing',
      areas: ['Attention', 'Memory', 'Problem Solving', 'Executive Function', 'Processing Speed']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Present Levels of Academic Achievement and Functional Performance (PLAAFP) describe the student's current abilities and needs.
      </div>

      {domains.map((domain) => (
        <Card key={domain.key}>
          <CardHeader>
            <CardTitle>{domain.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {domain.areas.map((area) => {
              const areaKey = `${domain.key}_${area.toLowerCase().replace(/\s+/g, '_')}`;
              const areaData = data[areaKey] || {};

              return (
                <div key={area} className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">{area}</h4>
                  
                  <div>
                    <Label htmlFor={`${areaKey}-level`}>Performance Level</Label>
                    <Select
                      value={areaData.level || ''}
                      onValueChange={(value) => 
                        updateData(areaKey, { ...areaData, level: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select performance level" />
                      </SelectTrigger>
                      <SelectContent>
                        {performanceLevels.map((level) => (
                          <SelectItem key={level} value={level.toLowerCase().replace(/\s+/g, '-')}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`${areaKey}-strengths`}>Strengths</Label>
                    <Textarea
                      id={`${areaKey}-strengths`}
                      placeholder={`Describe the student's strengths in ${area.toLowerCase()}...`}
                      value={areaData.strengths || ''}
                      onChange={(e) => 
                        updateData(areaKey, { ...areaData, strengths: e.target.value })
                      }
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${areaKey}-needs`}>Areas of Need</Label>
                    <Textarea
                      id={`${areaKey}-needs`}
                      placeholder={`Describe areas of need in ${area.toLowerCase()}...`}
                      value={areaData.needs || ''}
                      onChange={(e) => 
                        updateData(areaKey, { ...areaData, needs: e.target.value })
                      }
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${areaKey}-data`}>Supporting Data & Assessment Results</Label>
                    <Textarea
                      id={`${areaKey}-data`}
                      placeholder="Include specific test scores, classroom observations, work samples, etc..."
                      value={areaData.data || ''}
                      onChange={(e) => 
                        updateData(areaKey, { ...areaData, data: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${areaKey}-impact`}>Impact on General Education Curriculum</Label>
                    <Textarea
                      id={`${areaKey}-impact`}
                      placeholder="How does this area affect the student's involvement and progress in the general education curriculum?"
                      value={areaData.impact || ''}
                      onChange={(e) => 
                        updateData(areaKey, { ...areaData, impact: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Additional Considerations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="environmental-factors">Environmental Factors</Label>
            <Textarea
              id="environmental-factors"
              placeholder="Describe any environmental factors that impact the student's performance..."
              value={data.environmentalFactors || ''}
              onChange={(e) => updateData('environmentalFactors', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="cultural-linguistic">Cultural and Linguistic Considerations</Label>
            <Textarea
              id="cultural-linguistic"
              placeholder="Describe any cultural or linguistic factors relevant to the student's performance..."
              value={data.culturalLinguistic || ''}
              onChange={(e) => updateData('culturalLinguistic', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="assistive-technology">Current Assistive Technology Use</Label>
            <Textarea
              id="assistive-technology"
              placeholder="List any assistive technology currently being used by the student..."
              value={data.assistiveTechnology || ''}
              onChange={(e) => updateData('assistiveTechnology', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
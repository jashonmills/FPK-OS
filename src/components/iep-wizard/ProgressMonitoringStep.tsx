import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface DataCollectionMethod {
  id: string;
  goalArea: string;
  method: string;
  frequency: string;
  responsiblePerson: string;
  reportingSchedule: string;
}

interface ProgressMonitoringStepProps {
  data: any;
  onUpdate: (data: any) => void;
  jurisdiction: 'US_IDEA' | 'IE_EPSEN';
}

export function ProgressMonitoringStep({ data, onUpdate, jurisdiction }: ProgressMonitoringStepProps) {
  const dataCollectionMethods: DataCollectionMethod[] = data.dataCollectionMethods || [];

  const updateData = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const monitoringMethods = [
    'Curriculum-based measurement (CBM)',
    'Work samples/portfolio',
    'Behavioral data collection',
    'Teacher observation checklist',
    'Standardized assessments',
    'Performance-based assessments',
    'Digital data collection tools',
    'Video recording analysis',
    'Peer feedback',
    'Self-monitoring tools',
    'Progress charts/graphs'
  ];

  const reportingMethods = [
    'Written progress reports',
    'Data charts and graphs',
    'Portfolio reviews',
    'Parent conferences',
    'Phone calls',
    'Email updates',
    'Digital dashboards',
    'Video updates',
    'IEP team meetings'
  ];

  const stakeholders = [
    'Special education teacher',
    'General education teacher',
    'Related service providers',
    'Parents/guardians',
    'Student (age appropriate)',
    'Paraprofessional',
    'School psychologist',
    'Administrator'
  ];

  const addDataMethod = () => {
    const newMethod: DataCollectionMethod = {
      id: `method-${Date.now()}`,
      goalArea: '',
      method: '',
      frequency: '',
      responsiblePerson: '',
      reportingSchedule: ''
    };
    updateData('dataCollectionMethods', [...dataCollectionMethods, newMethod]);
  };

  const updateDataMethod = (methodId: string, field: keyof DataCollectionMethod, value: string) => {
    const updatedMethods = dataCollectionMethods.map(method =>
      method.id === methodId ? { ...method, [field]: value } : method
    );
    updateData('dataCollectionMethods', updatedMethods);
  };

  const removeDataMethod = (methodId: string) => {
    const updatedMethods = dataCollectionMethods.filter(method => method.id !== methodId);
    updateData('dataCollectionMethods', updatedMethods);
  };

  const toggleReportingMethod = (method: string) => {
    const current = data.reportingMethods || [];
    const updated = current.includes(method)
      ? current.filter((m: string) => m !== method)
      : [...current, method];
    updateData('reportingMethods', updated);
  };

  const toggleStakeholder = (stakeholder: string) => {
    const current = data.involvedStakeholders || [];
    const updated = current.includes(stakeholder)
      ? current.filter((s: string) => s !== stakeholder)
      : [...current, stakeholder];
    updateData('involvedStakeholders', updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Progress Monitoring:</strong> Regular collection and analysis of data to determine if the student is making adequate progress toward IEP goals.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Collection Methods</CardTitle>
              <p className="text-sm text-muted-foreground">
                Define how progress will be measured for each goal area
              </p>
            </div>
            <Button onClick={addDataMethod} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dataCollectionMethods.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No data collection methods added yet. Click "Add Method" to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {dataCollectionMethods.map((method, index) => (
                <Card key={method.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Data Collection Method {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDataMethod(method.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`goal-area-${method.id}`}>Goal/Objective Area</Label>
                      <Input
                        id={`goal-area-${method.id}`}
                        placeholder="e.g., Reading comprehension"
                        value={method.goalArea}
                        onChange={(e) => updateDataMethod(method.id, 'goalArea', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`method-${method.id}`}>Data Collection Method</Label>
                      <Select
                        value={method.method}
                        onValueChange={(value) => updateDataMethod(method.id, 'method', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          {monitoringMethods.map((methodOption) => (
                            <SelectItem key={methodOption} value={methodOption}>
                              {methodOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`frequency-${method.id}`}>Data Collection Frequency</Label>
                      <Select
                        value={method.frequency}
                        onValueChange={(value) => updateDataMethod(method.id, 'frequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="per-lesson">Per lesson/activity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`responsible-${method.id}`}>Responsible Person</Label>
                      <Input
                        id={`responsible-${method.id}`}
                        placeholder="Who will collect this data?"
                        value={method.responsiblePerson}
                        onChange={(e) => updateDataMethod(method.id, 'responsiblePerson', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor={`reporting-${method.id}`}>Reporting Schedule</Label>
                    <Select
                      value={method.reportingSchedule}
                      onValueChange={(value) => updateDataMethod(method.id, 'reportingSchedule', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reporting schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="progress-reports">With progress reports</SelectItem>
                        <SelectItem value="iep-meetings">At IEP meetings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress Reporting</CardTitle>
          <p className="text-sm text-muted-foreground">
            How will progress be communicated to parents and stakeholders?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Progress Reporting Methods</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {reportingMethods.map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={`reporting-${method}`}
                    checked={(data.reportingMethods || []).includes(method)}
                    onCheckedChange={() => toggleReportingMethod(method)}
                  />
                  <Label
                    htmlFor={`reporting-${method}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {method}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="reporting-frequency">Overall Reporting Frequency</Label>
            <Select
              value={data.reportingFrequency || ''}
              onValueChange={(value) => updateData('reportingFrequency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reporting frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quarterly">Quarterly (4 times per year)</SelectItem>
                <SelectItem value="trimester">Trimester (3 times per year)</SelectItem>
                <SelectItem value="semester">Semester (2 times per year)</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="as-needed">As needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="progress-report-format">Progress Report Format</Label>
            <Textarea
              id="progress-report-format"
              placeholder="Describe the format and content of progress reports..."
              value={data.progressReportFormat || ''}
              onChange={(e) => updateData('progressReportFormat', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Analysis and Decision Making</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="decision-criteria">Decision-Making Criteria</Label>
            <Textarea
              id="decision-criteria"
              placeholder="What criteria will be used to determine if the student is making adequate progress?"
              value={data.decisionCriteria || ''}
              onChange={(e) => updateData('decisionCriteria', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="insufficient-progress">Response to Insufficient Progress</Label>
            <Textarea
              id="insufficient-progress"
              placeholder="What steps will be taken if the student is not making adequate progress toward goals?"
              value={data.insufficientProgressResponse || ''}
              onChange={(e) => updateData('insufficientProgressResponse', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="data-review-schedule">Data Review Schedule</Label>
            <Select
              value={data.dataReviewSchedule || ''}
              onValueChange={(value) => updateData('dataReviewSchedule', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="How often will data be formally reviewed?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="iep-meetings">At IEP meetings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stakeholder Involvement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Who will be involved in progress monitoring?</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {stakeholders.map((stakeholder) => (
                <div key={stakeholder} className="flex items-center space-x-2">
                  <Checkbox
                    id={`stakeholder-${stakeholder}`}
                    checked={(data.involvedStakeholders || []).includes(stakeholder)}
                    onCheckedChange={() => toggleStakeholder(stakeholder)}
                  />
                  <Label
                    htmlFor={`stakeholder-${stakeholder}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {stakeholder}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="stakeholder-roles">Stakeholder Roles and Responsibilities</Label>
            <Textarea
              id="stakeholder-roles"
              placeholder="Describe the specific roles and responsibilities for each stakeholder in progress monitoring..."
              value={data.stakeholderRoles || ''}
              onChange={(e) => updateData('stakeholderRoles', e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="parent-involvement">Parent Involvement in Data Collection</Label>
            <Textarea
              id="parent-involvement"
              placeholder="How will parents be involved in collecting or reviewing progress data?"
              value={data.parentInvolvement || ''}
              onChange={(e) => updateData('parentInvolvement', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technology and Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="data-tools">Data Collection Tools and Technology</Label>
            <Textarea
              id="data-tools"
              placeholder="What tools, apps, or technology will be used for data collection and analysis?"
              value={data.dataTools || ''}
              onChange={(e) => updateData('dataTools', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="data-storage">Data Storage and Accessibility</Label>
            <Textarea
              id="data-storage"
              placeholder="How will progress data be stored and who will have access to it?"
              value={data.dataStorage || ''}
              onChange={(e) => updateData('dataStorage', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';
import { Plus, Trash2 } from 'lucide-react';

export const ProgressMonitoringStep = ({ data, onUpdate }: WizardStepProps) => {
  const methods = data.dataCollectionMethods || [];

  const addMethod = () => {
    onUpdate({
      ...data,
      dataCollectionMethods: [...methods, { goalArea: '', method: '', frequency: '', responsiblePerson: '', reportingSchedule: '' }]
    });
  };

  const removeMethod = (index: number) => {
    onUpdate({
      ...data,
      dataCollectionMethods: methods.filter((_: any, i: number) => i !== index)
    });
  };

  const updateMethod = (index: number, field: string, value: string) => {
    const updated = [...methods];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ ...data, dataCollectionMethods: updated });
  };

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="This step establishes how the student's progress toward IEP goals will be measured and reported."
        why="Regular progress monitoring ensures accountability and allows the team to adjust instruction when goals aren't being met."
        how="For each goal area, specify the data collection method, frequency, who's responsible, and the reporting schedule."
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Data Collection Methods</h3>
          <Button type="button" onClick={addMethod} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Method
          </Button>
        </div>

        {methods.map((method: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">Method {index + 1}</h4>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeMethod(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3">
              <Input
                placeholder="Goal/Objective Area"
                value={method.goalArea || ''}
                onChange={(e) => updateMethod(index, 'goalArea', e.target.value)}
              />
              <Select
                value={method.method || ''}
                onValueChange={(value) => updateMethod(index, 'method', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Data collection method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cbm">Curriculum-based measurement (CBM)</SelectItem>
                  <SelectItem value="work-samples">Work samples/portfolio</SelectItem>
                  <SelectItem value="behavioral">Behavioral data collection</SelectItem>
                  <SelectItem value="observation">Teacher observation checklist</SelectItem>
                  <SelectItem value="assessment">Standardized assessments</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid md:grid-cols-2 gap-3">
                <Select
                  value={method.frequency || ''}
                  onValueChange={(value) => updateMethod(index, 'frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Responsible Person"
                  value={method.responsiblePerson || ''}
                  onChange={(e) => updateMethod(index, 'responsiblePerson', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Label>Overall Reporting Frequency</Label>
        <Select
          value={data.reportingFrequency || ''}
          onValueChange={(value) => onUpdate({ ...data, reportingFrequency: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quarterly">Quarterly (4 times per year)</SelectItem>
            <SelectItem value="trimester">Trimester (3 times per year)</SelectItem>
            <SelectItem value="semester">Semester (2 times per year)</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Progress Report Format</Label>
        <Textarea
          value={data.reportFormat || ''}
          onChange={(e) => onUpdate({ ...data, reportFormat: e.target.value })}
          placeholder="Describe how progress will be reported to parents..."
          rows={3}
        />
      </div>
    </div>
  );
};
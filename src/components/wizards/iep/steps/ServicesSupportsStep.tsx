import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';
import { Plus, Trash2 } from 'lucide-react';

const US_SERVICES = [
  'Special Education',
  'Speech-Language Therapy',
  'Occupational Therapy',
  'Physical Therapy',
  'Counseling Services',
  'School Psychology Services',
  'Social Work Services',
  'Nursing Services',
  'Audiology Services',
  'Vision Services',
  'Transportation',
  'Assistive Technology Services'
];

const IRELAND_SERVICES = [
  'Special Education Teaching (SET)',
  'Special Needs Assistant (SNA)',
  'Speech and Language Therapy',
  'Occupational Therapy',
  'Psychology',
  'Guidance Counselling',
  'Resource Teaching',
  'Assistive Technology Support',
  'Therapeutic Services',
  'Transport Support'
];

const ACCOMMODATIONS = [
  'Extended time on tests',
  'Reduced number of items per page',
  'Large print materials',
  'Use of calculator',
  'Oral administration of tests',
  'Alternative test formats',
  'Frequent breaks',
  'Preferential seating',
  'Quiet testing environment',
  'Assistive technology',
  'Scribe services',
  'Sign language interpreter'
];

const MODIFICATIONS = [
  'Reduced number of test items',
  'Different grading scale',
  'Alternative curriculum',
  'Modified assignments',
  'Simplified language',
  'Different performance standards',
  'Alternative assessment methods',
  'Adapted materials'
];

export const ServicesSupportsStep = ({ data, onUpdate }: WizardStepProps) => {
  const jurisdiction = data.jurisdiction || 'US';
  const serviceTypes = jurisdiction === 'US' ? US_SERVICES : IRELAND_SERVICES;
  const services = data.services || [];
  const accommodations = data.accommodations || [];
  const modifications = data.modifications || [];

  const addService = () => {
    onUpdate({
      ...data,
      services: [...services, { type: '', frequency: '', duration: '', location: '', provider: '', startDate: '' }]
    });
  };

  const removeService = (index: number) => {
    onUpdate({
      ...data,
      services: services.filter((_: any, i: number) => i !== index)
    });
  };

  const updateService = (index: number, field: string, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    onUpdate({ ...data, services: updatedServices });
  };

  const toggleAccommodation = (accommodation: string) => {
    const updated = accommodations.includes(accommodation)
      ? accommodations.filter((a: string) => a !== accommodation)
      : [...accommodations, accommodation];
    onUpdate({ ...data, accommodations: updated });
  };

  const toggleModification = (modification: string) => {
    const updated = modifications.includes(modification)
      ? modifications.filter((m: string) => m !== modification)
      : [...modifications, modification];
    onUpdate({ ...data, modifications: updated });
  };

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="This step documents all special education and related services, accommodations, and modifications the student will receive."
        why="Services must be clearly specified with frequency, duration, and location to ensure proper implementation and accountability."
        how="Add each service with specific details, then select all relevant accommodations and modifications from the checklists."
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Special Education and Related Services</h3>
          <Button type="button" onClick={addService} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        {services.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No services added yet. Click "Add Service" to begin.</p>
          </div>
        )}

        <div className="space-y-4">
          {services.map((service: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">Service {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeService(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-3">
                <div>
                  <Label>Service Type *</Label>
                  <Select
                    value={service.type || ''}
                    onValueChange={(value) => updateService(index, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Frequency</Label>
                    <Input
                      value={service.frequency || ''}
                      onChange={(e) => updateService(index, 'frequency', e.target.value)}
                      placeholder="e.g., 2x per week"
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={service.duration || ''}
                      onChange={(e) => updateService(index, 'duration', e.target.value)}
                      placeholder="e.g., 30 minutes"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={service.location || ''}
                      onChange={(e) => updateService(index, 'location', e.target.value)}
                      placeholder="e.g., Resource Room"
                    />
                  </div>
                  <div>
                    <Label>Service Provider</Label>
                    <Input
                      value={service.provider || ''}
                      onChange={(e) => updateService(index, 'provider', e.target.value)}
                      placeholder="e.g., School Speech-Language Pathologist"
                    />
                  </div>
                </div>

                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={service.startDate || ''}
                    onChange={(e) => updateService(index, 'startDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Accommodations</h3>
        <p className="text-sm text-muted-foreground">
          Accommodations change HOW a student learns but not WHAT they learn
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {ACCOMMODATIONS.map((accommodation) => (
            <div key={accommodation} className="flex items-center space-x-2">
              <Checkbox
                id={accommodation}
                checked={accommodations.includes(accommodation)}
                onCheckedChange={() => toggleAccommodation(accommodation)}
              />
              <Label htmlFor={accommodation} className="font-normal cursor-pointer">
                {accommodation}
              </Label>
            </div>
          ))}
        </div>
        <div>
          <Label>Additional Accommodations</Label>
          <Textarea
            value={data.additionalAccommodations || ''}
            onChange={(e) => onUpdate({ ...data, additionalAccommodations: e.target.value })}
            placeholder="List any additional accommodations not included above..."
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Modifications</h3>
        <p className="text-sm text-muted-foreground">
          Modifications change WHAT a student learns or is expected to demonstrate
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {MODIFICATIONS.map((modification) => (
            <div key={modification} className="flex items-center space-x-2">
              <Checkbox
                id={modification}
                checked={modifications.includes(modification)}
                onCheckedChange={() => toggleModification(modification)}
              />
              <Label htmlFor={modification} className="font-normal cursor-pointer">
                {modification}
              </Label>
            </div>
          ))}
        </div>
        <div>
          <Label>Additional Modifications</Label>
          <Textarea
            value={data.additionalModifications || ''}
            onChange={(e) => onUpdate({ ...data, additionalModifications: e.target.value })}
            placeholder="List any additional modifications not included above..."
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Supplementary Aids and Services</Label>
        <Textarea
          value={data.supplementaryAids || ''}
          onChange={(e) => onUpdate({ ...data, supplementaryAids: e.target.value })}
          placeholder="Describe any additional aids, services, or program supports needed for the student to advance appropriately toward attaining the annual goals..."
          rows={3}
        />
      </div>
    </div>
  );
};
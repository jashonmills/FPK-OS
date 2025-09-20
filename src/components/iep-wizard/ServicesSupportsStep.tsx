import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface Service {
  id: string;
  type: string;
  frequency: string;
  duration: string;
  location: string;
  provider: string;
  startDate: string;
  endDate: string;
}

interface ServicesSupportsStepProps {
  data: any;
  onUpdate: (data: any) => void;
  jurisdiction: 'US_IDEA' | 'IE_EPSEN';
}

export function ServicesSupportsStep({ data, onUpdate, jurisdiction }: ServicesSupportsStepProps) {
  const services: Service[] = data.services || [];
  const accommodations = data.accommodations || [];
  const modifications = data.modifications || [];

  const updateData = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const serviceTypes = jurisdiction === 'US_IDEA' ? [
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
  ] : [
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

  const accommodationTypes = [
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

  const modificationTypes = [
    'Reduced number of test items',
    'Different grading scale',
    'Alternative curriculum',
    'Modified assignments',
    'Simplified language',
    'Different performance standards',
    'Alternative assessment methods',
    'Adapted materials'
  ];

  const addService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      type: '',
      frequency: '',
      duration: '',
      location: '',
      provider: '',
      startDate: '',
      endDate: ''
    };
    updateData('services', [...services, newService]);
  };

  const updateService = (serviceId: string, field: keyof Service, value: string) => {
    const updatedServices = services.map(service => 
      service.id === serviceId ? { ...service, [field]: value } : service
    );
    updateData('services', updatedServices);
  };

  const removeService = (serviceId: string) => {
    const updatedServices = services.filter(service => service.id !== serviceId);
    updateData('services', updatedServices);
  };

  const toggleAccommodation = (accommodation: string) => {
    const updated = accommodations.includes(accommodation)
      ? accommodations.filter((a: string) => a !== accommodation)
      : [...accommodations, accommodation];
    updateData('accommodations', updated);
  };

  const toggleModification = (modification: string) => {
    const updated = modifications.includes(modification)
      ? modifications.filter((m: string) => m !== modification)
      : [...modifications, modification];
    updateData('modifications', updated);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Special Education and Related Services</CardTitle>
            <Button onClick={addService} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No services added yet. Click "Add Service" to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {services.map((service, index) => (
                <Card key={service.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Service {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(service.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`service-type-${service.id}`}>Service Type</Label>
                      <Select
                        value={service.type}
                        onValueChange={(value) => updateService(service.id, 'type', value)}
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

                    <div>
                      <Label htmlFor={`frequency-${service.id}`}>Frequency</Label>
                      <Input
                        id={`frequency-${service.id}`}
                        placeholder="e.g., 2x per week"
                        value={service.frequency}
                        onChange={(e) => updateService(service.id, 'frequency', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`duration-${service.id}`}>Duration</Label>
                      <Input
                        id={`duration-${service.id}`}
                        placeholder="e.g., 30 minutes"
                        value={service.duration}
                        onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`location-${service.id}`}>Location</Label>
                      <Input
                        id={`location-${service.id}`}
                        placeholder="e.g., Resource Room"
                        value={service.location}
                        onChange={(e) => updateService(service.id, 'location', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`provider-${service.id}`}>Service Provider</Label>
                      <Input
                        id={`provider-${service.id}`}
                        placeholder="Provider name/title"
                        value={service.provider}
                        onChange={(e) => updateService(service.id, 'provider', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`start-date-${service.id}`}>Start Date</Label>
                      <Input
                        id={`start-date-${service.id}`}
                        type="date"
                        value={service.startDate}
                        onChange={(e) => updateService(service.id, 'startDate', e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accommodations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Changes in how the student accesses information and demonstrates learning
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accommodationTypes.map((accommodation) => (
              <div key={accommodation} className="flex items-center space-x-2">
                <Checkbox
                  id={`accommodation-${accommodation}`}
                  checked={accommodations.includes(accommodation)}
                  onCheckedChange={() => toggleAccommodation(accommodation)}
                />
                <Label
                  htmlFor={`accommodation-${accommodation}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {accommodation}
                </Label>
              </div>
            ))}
          </div>

          <div className="mt-4">
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
          <CardTitle>Modifications</CardTitle>
          <p className="text-sm text-muted-foreground">
            Changes in what the student is expected to learn or demonstrate
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modificationTypes.map((modification) => (
              <div key={modification} className="flex items-center space-x-2">
                <Checkbox
                  id={`modification-${modification}`}
                  checked={modifications.includes(modification)}
                  onCheckedChange={() => toggleModification(modification)}
                />
                <Label
                  htmlFor={`modification-${modification}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {modification}
                </Label>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Label htmlFor="additional-modifications">Additional Modifications</Label>
            <Textarea
              id="additional-modifications"
              placeholder="Describe any additional modifications not listed above..."
              value={data.additionalModifications || ''}
              onChange={(e) => updateData('additionalModifications', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supplementary Aids and Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="supplementary-aids">Supplementary Aids and Services</Label>
            <Textarea
              id="supplementary-aids"
              placeholder="Describe any supplementary aids and services for school personnel..."
              value={data.supplementaryAids || ''}
              onChange={(e) => updateData('supplementaryAids', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
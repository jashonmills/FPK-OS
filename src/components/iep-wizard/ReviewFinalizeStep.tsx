import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Download, FileText, Users } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ReviewFinalizeStepProps {
  data: any;
  onUpdate: (data: any) => void;
  jurisdiction: 'US_IDEA' | 'IE_EPSEN';
  formData: Record<number, any>;
  steps: any[];
}

export function ReviewFinalizeStep({ data, onUpdate, jurisdiction, formData, steps }: ReviewFinalizeStepProps) {
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  
  const updateData = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const requiredSignatures = jurisdiction === 'US_IDEA' ? [
    'Parent/Guardian',
    'Special Education Teacher',
    'General Education Teacher',
    'LEA Representative',
    'Individual who can interpret evaluation results'
  ] : [
    'Parent/Guardian',
    'Special Education Teacher/SET',
    'Principal/Deputy Principal',
    'Educational Psychologist (if applicable)',
    'Other relevant professionals'
  ];

  const completionChecklist = [
    {
      step: 1,
      title: 'Student Profile',
      completed: !!formData[1]?.firstName && !!formData[1]?.lastName,
      required: true
    },
    {
      step: 2,
      title: 'Jurisdiction & Consent',
      completed: !!formData[2]?.parentConsent,
      required: true
    },
    {
      step: 3,
      title: 'Concerns & Referral',
      completed: !!formData[3]?.primaryConcerns,
      required: true
    },
    {
      step: 4,
      title: 'Screening & Eligibility',
      completed: !!formData[4]?.eligibilityStatus,
      required: true
    },
    {
      step: 5,
      title: 'Present Levels',
      completed: Object.keys(formData[5] || {}).length > 0,
      required: true
    },
    {
      step: 6,
      title: 'Goals & Objectives',
      completed: !!(formData[6]?.goals && formData[6].goals.length > 0),
      required: true
    },
    {
      step: 7,
      title: 'Services & Supports',
      completed: !!(formData[7]?.services && formData[7].services.length > 0),
      required: true
    },
    {
      step: 8,
      title: 'LRE & Placement',
      completed: !!formData[8]?.currentPlacement,
      required: true
    },
    {
      step: 9,
      title: 'Transition Planning',
      completed: !!formData[9]?.studentAge || parseInt(formData[1]?.age || '0') < 14,
      required: false
    },
    {
      step: 10,
      title: 'Assessment Participation',
      completed: Object.keys(formData[10] || {}).some(key => key.includes('Participation')),
      required: true
    },
    {
      step: 11,
      title: 'Parent & Student Input',
      completed: !!formData[11]?.familyVision,
      required: true
    },
    {
      step: 12,
      title: 'Progress Monitoring',
      completed: !!(formData[12]?.dataCollectionMethods && formData[12].dataCollectionMethods.length > 0),
      required: true
    }
  ];

  const completedRequired = completionChecklist.filter(item => item.required && item.completed).length;
  const totalRequired = completionChecklist.filter(item => item.required).length;
  const completionPercentage = Math.round((completedRequired / totalRequired) * 100);

  const generateDocument = async () => {
    setIsGeneratingDocument(true);
    try {
      // This would integrate with a document generation service
      // For now, we'll show a placeholder
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateData('documentGenerated', true);
      updateData('documentGeneratedAt', new Date().toISOString());
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsGeneratingDocument(false);
    }
  };

  const addSignature = () => {
    const signatures = data.signatures || [];
    const newSignature = {
      id: `sig-${Date.now()}`,
      role: '',
      name: '',
      title: '',
      date: '',
      signature: '',
      agreed: false
    };
    updateData('signatures', [...signatures, newSignature]);
  };

  const updateSignature = (sigId: string, field: string, value: any) => {
    const signatures = data.signatures || [];
    const updated = signatures.map((sig: any) => 
      sig.id === sigId ? { ...sig, [field]: value } : sig
    );
    updateData('signatures', updated);
  };

  const removeSignature = (sigId: string) => {
    const signatures = data.signatures || [];
    const updated = signatures.filter((sig: any) => sig.id !== sigId);
    updateData('signatures', updated);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            IEP Completion Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Completion</span>
              <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
                {completionPercentage}% Complete
              </Badge>
            </div>

            <div className="space-y-2">
              {completionChecklist.map((item) => (
                <div key={item.step} className="flex items-center gap-3 p-2 rounded border">
                  {item.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  )}
                  <span className="text-sm flex-1">{item.title}</span>
                  {item.required && (
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  )}
                </div>
              ))}
            </div>

            {completionPercentage < 100 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  <strong>Action Required:</strong> Please complete all required sections before finalizing the IEP.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>IEP Summary Review</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review key information from each section
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="student-info">
              <AccordionTrigger>Student Information</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {formData[1]?.firstName} {formData[1]?.lastName}</p>
                  <p><strong>Age:</strong> {formData[1]?.age}</p>
                  <p><strong>Grade:</strong> {formData[1]?.grade}</p>
                  <p><strong>School:</strong> {formData[1]?.school}</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="eligibility">
              <AccordionTrigger>Eligibility</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Status:</strong> {formData[4]?.eligibilityStatus}</p>
                  <p><strong>Primary Category:</strong> {formData[4]?.primaryCategory}</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="goals">
              <AccordionTrigger>Goals ({formData[6]?.goals?.length || 0} goals)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  {(formData[6]?.goals || []).map((goal: any, index: number) => (
                    <div key={goal.id} className="border-l-2 border-blue-200 pl-3">
                      <p><strong>Goal {index + 1}:</strong> {goal.domain}</p>
                      <p className="text-muted-foreground">{goal.measurableGoal?.substring(0, 100)}...</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="services">
              <AccordionTrigger>Services ({formData[7]?.services?.length || 0} services)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  {(formData[7]?.services || []).map((service: any, index: number) => (
                    <div key={service.id} className="border-l-2 border-green-200 pl-3">
                      <p><strong>{service.type}</strong></p>
                      <p className="text-muted-foreground">{service.frequency} - {service.duration}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="placement">
              <AccordionTrigger>Placement</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Current Placement:</strong> {formData[8]?.currentPlacement}</p>
                  <p><strong>Gen Ed Participation:</strong> {formData[8]?.genEdParticipation}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={generateDocument}
              disabled={isGeneratingDocument || completionPercentage < 100}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {isGeneratingDocument ? 'Generating...' : 'Generate IEP Document'}
            </Button>

            {data.documentGenerated && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">Document generated successfully</span>
              </div>
            )}
          </div>

          {data.documentGenerated && (
            <div className="space-y-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download IEP Document (PDF)
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Parent Copy
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Team Summary
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Electronic Signatures
            </CardTitle>
            <Button onClick={addSignature} variant="outline" size="sm">
              Add Signature
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.signatures || []).map((signature: any) => (
            <Card key={signature.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`role-${signature.id}`}>Role/Position</Label>
                  <Input
                    id={`role-${signature.id}`}
                    placeholder="e.g., Special Education Teacher"
                    value={signature.role}
                    onChange={(e) => updateSignature(signature.id, 'role', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor={`name-${signature.id}`}>Full Name</Label>
                  <Input
                    id={`name-${signature.id}`}
                    placeholder="Full name"
                    value={signature.name}
                    onChange={(e) => updateSignature(signature.id, 'name', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor={`title-${signature.id}`}>Title/Credentials</Label>
                  <Input
                    id={`title-${signature.id}`}
                    placeholder="Professional title"
                    value={signature.title}
                    onChange={(e) => updateSignature(signature.id, 'title', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor={`date-${signature.id}`}>Date</Label>
                  <Input
                    id={`date-${signature.id}`}
                    type="date"
                    value={signature.date}
                    onChange={(e) => updateSignature(signature.id, 'date', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor={`signature-${signature.id}`}>Electronic Signature</Label>
                  <Input
                    id={`signature-${signature.id}`}
                    placeholder="Type full name to serve as electronic signature"
                    value={signature.signature}
                    onChange={(e) => updateSignature(signature.id, 'signature', e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`agree-${signature.id}`}
                    checked={signature.agreed}
                    onCheckedChange={(checked) => updateSignature(signature.id, 'agreed', checked)}
                  />
                  <Label htmlFor={`agree-${signature.id}`} className="text-sm">
                    I agree that this electronic signature has the same legal effect as a handwritten signature
                  </Label>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSignature(signature.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Remove Signature
                </Button>
              </div>
            </Card>
          ))}

          {(!data.signatures || data.signatures.length === 0) && (
            <p className="text-muted-foreground text-center py-4">
              No signatures added yet. Click "Add Signature" to add team member signatures.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Final Comments and Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="team-comments">IEP Team Comments</Label>
            <Textarea
              id="team-comments"
              placeholder="Any additional comments from the IEP team..."
              value={data.teamComments || ''}
              onChange={(e) => updateData('teamComments', e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="implementation-notes">Implementation Notes</Label>
            <Textarea
              id="implementation-notes"
              placeholder="Special instructions for IEP implementation..."
              value={data.implementationNotes || ''}
              onChange={(e) => updateData('implementationNotes', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="next-review">Next Annual Review Date</Label>
            <Input
              id="next-review"
              type="date"
              value={data.nextReviewDate || ''}
              onChange={(e) => updateData('nextReviewDate', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            'All required sections completed',
            'Present Levels documented with supporting data',
            'Measurable annual goals established',
            'Services and supports specified with frequency and duration',
            'LRE determination documented',
            'Assessment participation determined',
            'Progress monitoring plan established',
            'Parent input documented',
            'All required signatures obtained'
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`compliance-${index}`}
                checked={(data.complianceChecklist || []).includes(item)}
                onCheckedChange={(checked) => {
                  const current = data.complianceChecklist || [];
                  const updated = checked
                    ? [...current, item]
                    : current.filter((i: string) => i !== item);
                  updateData('complianceChecklist', updated);
                }}
              />
              <Label htmlFor={`compliance-${index}`} className="text-sm">
                {item}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
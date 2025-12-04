import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface JurisdictionConsentStepProps {
  data: any;
  onUpdate: (data: any) => void;
  jurisdiction: 'US_IDEA' | 'IE_EPSEN';
  onJurisdictionChange: (jurisdiction: 'US_IDEA' | 'IE_EPSEN') => void;
}

export function JurisdictionConsentStep({ 
  data, 
  onUpdate, 
  jurisdiction, 
  onJurisdictionChange 
}: JurisdictionConsentStepProps) {
  const updateData = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const jurisdictionInfo = {
    US_IDEA: {
      title: 'United States - IDEA (Individuals with Disabilities Education Act)',
      description: 'Federal special education law ensuring students with disabilities receive free appropriate public education (FAPE) in the least restrictive environment (LRE).',
      requirements: [
        'Free Appropriate Public Education (FAPE)',
        'Least Restrictive Environment (LRE)',
        'Individualized Education Program (IEP)',
        'Procedural Safeguards',
        'Parent and Student Participation',
        'Transition Services (age 16+)'
      ]
    },
    IE_EPSEN: {
      title: 'Ireland - EPSEN Act (Education for Persons with Special Educational Needs)',
      description: 'Irish legislation ensuring inclusive education and support for students with special educational needs.',
      requirements: [
        'Inclusive Education Environment',
        'Individual Education Plans',
        'Continuum of Support Model',
        'Assessment of Need Process',
        'Appeal Procedures',
        'Resource Allocation (SET/SNA)'
      ]
    }
  };

  const currentJurisdiction = jurisdictionInfo[jurisdiction];
  const requiredConsents = jurisdiction === 'US_IDEA' ? [
    {
      key: 'evaluation',
      title: 'Consent for Initial Evaluation',
      description: 'Permission to conduct comprehensive evaluations to determine eligibility for special education services',
      required: true
    },
    {
      key: 'services',
      title: 'Consent for Special Education Services',
      description: 'Agreement to receive special education and related services as outlined in the IEP',
      required: true
    },
    {
      key: 'records',
      title: 'Consent for Release of Educational Records',
      description: 'Permission to share educational records with relevant professionals and agencies',
      required: false
    },
    {
      key: 'reevaluation',
      title: 'Understanding of Reevaluation Rights',
      description: 'Acknowledgment of rights regarding periodic reevaluations',
      required: true
    }
  ] : [
    {
      key: 'assessment',
      title: 'Consent for Assessment of Need',
      description: 'Permission to conduct assessment to determine special educational needs',
      required: true
    },
    {
      key: 'plan',
      title: 'Agreement to Individual Education Plan',
      description: 'Consent to develop and implement an individual education plan',
      required: true
    },
    {
      key: 'resources',
      title: 'Consent for Resource Allocation',
      description: 'Agreement to provision of SET/SNA hours and other supports',
      required: false
    },
    {
      key: 'information',
      title: 'Information Sharing Consent',
      description: 'Permission to share information with NCSE and other relevant bodies',
      required: false
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Jurisdiction</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose the legal framework that applies to this IEP
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={jurisdiction}
            onValueChange={(value) => onJurisdictionChange(value as 'US_IDEA' | 'IE_EPSEN')}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="US_IDEA" id="US_IDEA" className="mt-1" />
              <div className="space-y-2">
                <Label htmlFor="US_IDEA" className="text-base font-medium cursor-pointer">
                  United States - IDEA
                </Label>
                <p className="text-sm text-muted-foreground">
                  Individuals with Disabilities Education Act (federal law)
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="IE_EPSEN" id="IE_EPSEN" className="mt-1" />
              <div className="space-y-2">
                <Label htmlFor="IE_EPSEN" className="text-base font-medium cursor-pointer">
                  Ireland - EPSEN Act
                </Label>
                <p className="text-sm text-muted-foreground">
                  Education for Persons with Special Educational Needs Act 2004
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentJurisdiction.title}
            <Badge variant="outline">{jurisdiction}</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {currentJurisdiction.description}
          </p>
        </CardHeader>
        <CardContent>
          <div>
            <h4 className="font-medium mb-3">Key Requirements:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {currentJurisdiction.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required Consents and Agreements</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please review and provide consent for the following items
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {requiredConsents.map((consent) => (
            <div key={consent.key} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{consent.title}</h4>
                    {consent.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {consent.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={consent.key}
                  checked={data[consent.key] || false}
                  onCheckedChange={(checked) => updateData(consent.key, checked)}
                />
                <Label htmlFor={consent.key} className="text-sm cursor-pointer">
                  I provide consent / I agree
                </Label>
              </div>
            </div>
          ))}

          <div className="space-y-3">
            <Label htmlFor="parentConsent">Parent/Guardian Signature</Label>
            <input
              id="parentConsent"
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Type full name to serve as electronic signature"
              value={data.parentConsent || ''}
              onChange={(e) => updateData('parentConsent', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              By typing your full name above, you acknowledge that this serves as your electronic 
              signature and has the same legal effect as a handwritten signature.
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="additionalComments">Additional Comments or Concerns</Label>
            <Textarea
              id="additionalComments"
              placeholder="Any additional comments, questions, or concerns regarding consents..."
              value={data.additionalComments || ''}
              onChange={(e) => updateData('additionalComments', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
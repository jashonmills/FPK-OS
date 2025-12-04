import { WizardStepProps } from '@/lib/wizards/types';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';

export const JurisdictionConsentStep = ({ data, onUpdate }: WizardStepProps) => {
  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="This step determines which legal framework will guide your IEP development."
        why="Different countries have different special education laws. The US follows IDEA (Individuals with Disabilities Education Act), while Ireland follows the EPSEN Act (Education for Persons with Special Educational Needs Act)."
        how="Select your jurisdiction to ensure all forms, terminology, and requirements match your local legal requirements."
      />

      <div className="space-y-4">
        <Label className="text-lg font-semibold">Select Your Jurisdiction</Label>
        <RadioGroup
          value={data.jurisdiction || 'us'}
          onValueChange={(value) => onUpdate({ ...data, jurisdiction: value })}
          className="gap-4"
        >
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="us" id="us" />
              <Label htmlFor="us" className="flex items-center gap-2 cursor-pointer flex-1">
                <span className="text-2xl">🇺🇸</span>
                <div>
                  <div className="font-semibold">United States (IDEA)</div>
                  <div className="text-sm text-muted-foreground">
                    Follows Individuals with Disabilities Education Act
                  </div>
                </div>
              </Label>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="ireland" id="ireland" />
              <Label htmlFor="ireland" className="flex items-center gap-2 cursor-pointer flex-1">
                <span className="text-2xl">🇮🇪</span>
                <div>
                  <div className="font-semibold">Ireland (EPSEN Act)</div>
                  <div className="text-sm text-muted-foreground">
                    Follows Education for Persons with Special Educational Needs Act
                  </div>
                </div>
              </Label>
            </div>
          </Card>
        </RadioGroup>
      </div>
    </div>
  );
};

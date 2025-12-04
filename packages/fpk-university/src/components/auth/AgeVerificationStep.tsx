import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, ShieldCheck, AlertTriangle } from 'lucide-react';
import { differenceInYears, parse, isValid } from 'date-fns';

interface AgeVerificationStepProps {
  onVerified: (dateOfBirth: string, isMinor: boolean) => void;
  onBack: () => void;
}

export const AgeVerificationStep: React.FC<AgeVerificationStepProps> = ({
  onVerified,
  onBack
}) => {
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  const calculateAge = (dob: string): number => {
    const date = parse(dob, 'yyyy-MM-dd', new Date());
    if (!isValid(date)) return -1;
    return differenceInYears(new Date(), date);
  };

  const handleContinue = () => {
    setError('');
    
    if (!birthDate) {
      setError('Please enter your date of birth');
      return;
    }

    const age = calculateAge(birthDate);
    
    if (age < 0) {
      setError('Please enter a valid date of birth');
      return;
    }

    if (age < 5) {
      setError('You must be at least 5 years old to create an account');
      return;
    }

    if (age > 120) {
      setError('Please enter a valid date of birth');
      return;
    }

    // COPPA threshold is 13 years old
    const isMinor = age < 13;
    onVerified(birthDate, isMinor);
  };

  const age = birthDate ? calculateAge(birthDate) : null;
  const showMinorWarning = age !== null && age >= 5 && age < 13;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-xl font-semibold">Age Verification</h2>
        <p className="text-sm text-muted-foreground">
          To comply with children's privacy laws (COPPA), we need to verify your age.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="bg-white"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showMinorWarning && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Parental Consent Required</strong>
              <br />
              Since you're under 13, we'll need a parent or guardian to approve your account before you can use all features.
            </AlertDescription>
          </Alert>
        )}

        {age !== null && age >= 13 && (
          <Alert className="border-green-200 bg-green-50">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Great! You meet the age requirement to create an account.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleContinue} className="flex-1 fpk-gradient text-white">
          Continue
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Your date of birth is stored securely and used only for age verification purposes in compliance with COPPA regulations.
      </p>
    </div>
  );
};

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, ShieldCheck, Clock } from 'lucide-react';
import { z } from 'zod';

const parentEmailSchema = z.object({
  parentEmail: z.string().email('Please enter a valid email address'),
  confirmEmail: z.string().email('Please enter a valid email address'),
  acknowledged: z.boolean().refine(val => val === true, 'You must acknowledge the terms')
}).refine(data => data.parentEmail === data.confirmEmail, {
  message: "Email addresses don't match",
  path: ['confirmEmail']
});

interface ParentalConsentFormProps {
  childName: string;
  onSubmit: (parentEmail: string) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

export const ParentalConsentForm: React.FC<ParentalConsentFormProps> = ({
  childName,
  onSubmit,
  onBack,
  isSubmitting
}) => {
  const [parentEmail, setParentEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const validated = parentEmailSchema.parse({
        parentEmail,
        confirmEmail,
        acknowledged
      });
      
      await onSubmit(validated.parentEmail);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-xl font-semibold">Parent/Guardian Consent Required</h2>
        <p className="text-sm text-muted-foreground">
          To protect children's privacy under COPPA, we need permission from a parent or guardian.
        </p>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <ShieldCheck className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>What happens next:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
            <li>We'll send an email to your parent/guardian</li>
            <li>They'll review and approve your account</li>
            <li>Once approved, you can use all features</li>
          </ol>
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="parent-email">Parent/Guardian Email</Label>
          <Input
            id="parent-email"
            type="email"
            placeholder="parent@example.com"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            className="bg-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-parent-email">Confirm Email</Label>
          <Input
            id="confirm-parent-email"
            type="email"
            placeholder="parent@example.com"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            className="bg-white"
            required
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="acknowledge"
            checked={acknowledged}
            onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
          />
          <Label htmlFor="acknowledge" className="text-sm leading-relaxed cursor-pointer">
            I confirm this is my parent or guardian's email, and I understand they will need to approve my account.
          </Label>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={isSubmitting}>
            Back
          </Button>
          <Button type="submit" className="flex-1 fpk-gradient text-white" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Consent Request'
            )}
          </Button>
        </div>
      </form>

      <p className="text-xs text-center text-muted-foreground">
        The consent request expires in 7 days. Your parent/guardian can request a new one if needed.
      </p>
    </div>
  );
};

import { WizardStepProps } from '@/lib/wizards/types';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TextareaWithVoice } from '@/components/shared/TextareaWithVoice';

export const ConcernsReferralStep = ({ data, onUpdate }: WizardStepProps) => {
  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="This section captures your primary concerns about your child's education and development."
        why="Your voice as a parent is legally required in the IEP. These concerns guide the team in identifying needs and setting priorities. They also create a record of what matters most to you."
        how="Describe your observations, worries, and hopes. Be specific about challenges you see at home or in school. Use the voice input or AI tools to help articulate your thoughts."
      />

      <div className="space-y-4">
        <div>
          <Label htmlFor="parentConcerns" className="text-base font-semibold">
            Parent Concerns <span className="text-destructive">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            What are your main concerns about your child's educational progress?
          </p>
          <TextareaWithVoice
            id="parentConcerns"
            value={data.parentConcerns || ''}
            onChange={(e) => onUpdate({ ...data, parentConcerns: e.target.value })}
            placeholder="Example: I'm concerned that my child struggles to focus during reading time and often becomes frustrated when asked to write..."
            rows={8}
          />
        </div>

        <div>
          <Label htmlFor="referralReason" className="text-base font-semibold">
            Reason for Referral (if applicable)
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Why was your child referred for special education services?
          </p>
          <Textarea
            id="referralReason"
            value={data.referralReason || ''}
            onChange={(e) => onUpdate({ ...data, referralReason: e.target.value })}
            placeholder="Example: Teacher referral due to persistent reading difficulties..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

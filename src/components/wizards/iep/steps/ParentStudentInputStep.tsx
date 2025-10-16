import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';

export const ParentStudentInputStep = ({ data, onUpdate }: WizardStepProps) => {
  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="This step captures the family's vision for the student and the student's own voice in their education."
        why="Parent and student input is legally required and ensures the IEP reflects the family's priorities and the student's goals."
        how="Document the family's vision, priorities, and concerns, as well as the student's own interests and goals when age-appropriate."
      />

      <div className="space-y-4">
        <div>
          <Label>Family Vision for the Student *</Label>
          <Textarea
            value={data.familyVision || ''}
            onChange={(e) => onUpdate({ ...data, familyVision: e.target.value })}
            placeholder="What are your hopes and dreams for your child? What do you envision for their future?"
            rows={4}
          />
        </div>

        <div>
          <Label>Family Priorities</Label>
          <Textarea
            value={data.familyPriorities || ''}
            onChange={(e) => onUpdate({ ...data, familyPriorities: e.target.value })}
            placeholder="What are the most important areas for your child to work on this year?"
            rows={3}
          />
        </div>

        <div>
          <Label>Family Concerns</Label>
          <Textarea
            value={data.familyConcerns || ''}
            onChange={(e) => onUpdate({ ...data, familyConcerns: e.target.value })}
            placeholder="What concerns do you have about your child's education or development?"
            rows={3}
          />
        </div>

        <div>
          <Label>Student's Interests and Preferences</Label>
          <Textarea
            value={data.studentInterests || ''}
            onChange={(e) => onUpdate({ ...data, studentInterests: e.target.value })}
            placeholder="What does the student enjoy? What are their hobbies, interests, and preferences?"
            rows={3}
          />
        </div>

        <div>
          <Label>Student's Personal Goals</Label>
          <Textarea
            value={data.studentGoals || ''}
            onChange={(e) => onUpdate({ ...data, studentGoals: e.target.value })}
            placeholder="What goals does the student have for themselves? (if age-appropriate to provide input)"
            rows={3}
          />
        </div>

        <div>
          <Label>Communication Preferences</Label>
          <Textarea
            value={data.communicationPreferences || ''}
            onChange={(e) => onUpdate({ ...data, communicationPreferences: e.target.value })}
            placeholder="How do you prefer to receive updates about your child's progress? (email, phone, in-person, etc.)"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};
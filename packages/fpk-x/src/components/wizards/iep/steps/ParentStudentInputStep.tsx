import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';
import { AIAssistMenu } from '@/components/wizards/shared/AIAssistMenu';
import { useFamily } from '@/contexts/FamilyContext';
import { supabase } from '@/integrations/supabase/client';

export const ParentStudentInputStep = ({ data, onUpdate }: WizardStepProps) => {
  const { selectedFamily, selectedStudent } = useFamily();

  const handleAIAssist = async (action: 'rewrite' | 'expand' | 'suggest', currentText: string, fieldContext: string) => {
    try {
      const { data: result, error } = await supabase.functions.invoke('iep-ai-assist', {
        body: {
          action,
          currentText,
          context: {
            familyId: selectedFamily?.id,
            studentId: selectedStudent?.id,
            fieldContext,
          },
        },
      });

      if (error) throw error;

      return result.enhancedText;
    } catch (error) {
      console.error('Error with AI assist:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="This step captures the family's vision for the student and the student's own voice in their education."
        why="Parent and student input is legally required and ensures the IEP reflects the family's priorities and the student's goals."
        how="Document the family's vision, priorities, and concerns, as well as the student's own interests and goals when age-appropriate."
      />

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Family Vision for the Student *</Label>
            <AIAssistMenu
              currentText={data.familyVision || ''}
              onAssist={(action, text) => handleAIAssist(action, text, 'Family Vision')}
              onUpdate={(text) => onUpdate({ ...data, familyVision: text })}
            />
          </div>
          <Textarea
            value={data.familyVision || ''}
            onChange={(e) => onUpdate({ ...data, familyVision: e.target.value })}
            placeholder="What are your hopes and dreams for your child? What do you envision for their future?"
            rows={4}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Family Priorities</Label>
            <AIAssistMenu
              currentText={data.familyPriorities || ''}
              onAssist={(action, text) => handleAIAssist(action, text, 'Family Priorities')}
              onUpdate={(text) => onUpdate({ ...data, familyPriorities: text })}
            />
          </div>
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
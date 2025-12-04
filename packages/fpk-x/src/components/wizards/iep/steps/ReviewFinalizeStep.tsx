import { WizardStepProps } from '@/lib/wizards/types';
import { Button } from '@/components/ui/button';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';
import { CheckCircle2, Download } from 'lucide-react';

export const ReviewFinalizeStep = ({ data }: WizardStepProps) => {
  const completionPercentage = 85; // Mock percentage

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="Review all IEP sections for completeness and accuracy before finalizing and generating the official document."
        why="The IEP is a legal document that guides the student's education. Thorough review ensures all required components are included."
        how="Check the completion status, review each section summary, then generate and download the official IEP document."
      />

      <div className="text-center py-8 border-2 border-dashed rounded-lg">
        <div className="text-4xl font-bold text-primary mb-2">{completionPercentage}%</div>
        <p className="text-muted-foreground">IEP Completion</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          Completion Checklist
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Student Profile Complete
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Jurisdiction & Consents Obtained
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Present Levels Documented
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Goals & Objectives Established
          </li>
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <Button disabled>
          <Download className="h-4 w-4 mr-2" />
          Generate IEP Document
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Document generation will be available when all required sections are complete
      </p>
    </div>
  );
};
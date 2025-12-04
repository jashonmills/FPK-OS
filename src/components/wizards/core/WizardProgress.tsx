import { Progress } from '@/components/ui/progress';

interface WizardProgressProps {
  current: number;
  total: number;
}

export const WizardProgress = ({ current, total }: WizardProgressProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Step {current} of {total}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round(percentage)}% Complete
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

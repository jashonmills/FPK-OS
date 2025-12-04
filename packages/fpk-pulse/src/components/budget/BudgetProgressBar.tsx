import { Progress } from '@/components/ui/progress';

interface BudgetProgressBarProps {
  totalBudget: number;
  totalSpent: number;
}

export const BudgetProgressBar = ({ totalBudget, totalSpent }: BudgetProgressBarProps) => {
  const percentage = Math.min((totalSpent / totalBudget) * 100, 100);
  
  const getColor = () => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Progress value={percentage} className="h-8" />
        <div className={`absolute inset-0 h-8 rounded-full transition-all ${getColor()}`} 
             style={{ width: `${percentage}%` }} 
        />
      </div>
      
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-muted-foreground">Spent</p>
          <p className="font-semibold">${totalSpent.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">Budget</p>
          <p className="font-semibold">${totalBudget.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-2xl font-bold">{percentage.toFixed(1)}%</p>
        <p className="text-sm text-muted-foreground">of budget used</p>
      </div>
    </div>
  );
};

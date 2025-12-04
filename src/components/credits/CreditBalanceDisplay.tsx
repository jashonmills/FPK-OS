import { useAICredits } from '@/hooks/useAICredits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, TrendingUp, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';

export const CreditBalanceDisplay = () => {
  const { balance, loading } = useAICredits();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Credits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!balance) {
    return null;
  }

  const usagePercentage = ((balance.monthly_allowance - balance.monthly_credits) / balance.monthly_allowance) * 100;
  const isLowBalance = balance.total_credits < balance.monthly_allowance * 0.2;

  return (
    <Card className={isLowBalance ? 'border-destructive' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          AI Credits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Balance */}
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">
            {balance.total_credits.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Total Credits Available
          </p>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Monthly
            </div>
            <div className="font-semibold">
              {balance.monthly_credits.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Purchased
            </div>
            <div className="font-semibold">
              {balance.purchased_credits.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Monthly Usage Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Usage</span>
            <span className="font-medium">{usagePercentage.toFixed(0)}%</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {balance.monthly_credits} / {balance.monthly_allowance} monthly credits remaining
          </p>
        </div>

        {/* Reset Info */}
        <div className="text-xs text-muted-foreground border-t pt-3">
          Monthly credits reset {formatDistanceToNow(new Date(balance.last_monthly_reset), { addSuffix: true })}
        </div>

        {/* Low Balance Warning */}
        {isLowBalance && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-3 text-sm">
            <p className="font-medium text-destructive">Low Credit Balance</p>
            <p className="text-muted-foreground mt-1">
              You're running low on credits. Consider purchasing more to continue using AI features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

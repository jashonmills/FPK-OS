import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const BudgetOverview = () => {
  const navigate = useNavigate();

  const { data: budgets, isLoading } = useQuery({
    queryKey: ['budgets-overview'],
    queryFn: async () => {
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('project_budgets')
        .select('*, projects(name, color)');
      
      if (budgetsError) throw budgetsError;

      const { data: expensesData, error: expensesError } = await supabase
        .from('project_expenses')
        .select('project_id, amount');
      
      if (expensesError) throw expensesError;

      return budgetsData.map(budget => {
        const projectExpenses = expensesData.filter(e => e.project_id === budget.project_id);
        const totalSpent = projectExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const remaining = Number(budget.total_budget) - totalSpent;
        const percentUsed = (totalSpent / Number(budget.total_budget)) * 100;

        return {
          ...budget,
          totalSpent,
          remaining,
          percentUsed,
        };
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!budgets || budgets.length === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="rounded-full bg-muted p-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No Budgets Found</h3>
            <p className="text-muted-foreground max-w-md">
              Create budgets for your projects to start tracking expenses and managing finances.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.total_budget), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.totalSpent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentUsed = (totalSpent / totalBudget) * 100;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {budgets.length} projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{overallPercentUsed.toFixed(1)}% of total budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalRemaining < 0 ? 'text-destructive' : ''}`}>
              ${Math.abs(totalRemaining).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalRemaining < 0 ? 'Over budget' : 'Available'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Projects</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map(budget => (
            <Card 
              key={budget.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                const params = new URLSearchParams({ project: budget.project_id });
                navigate(`/budget?${params.toString()}`);
                window.location.reload();
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: budget.projects?.color }}
                  />
                  <CardTitle className="text-base">{budget.projects?.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-semibold">${Number(budget.total_budget).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent:</span>
                  <span className="font-semibold">${budget.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className={`font-semibold ${budget.remaining < 0 ? 'text-destructive' : ''}`}>
                    ${Math.abs(budget.remaining).toLocaleString()}
                  </span>
                </div>
                <div className="pt-2">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        budget.percentUsed >= 90 ? 'bg-destructive' :
                        budget.percentUsed >= 75 ? 'bg-warning' :
                        'bg-success'
                      }`}
                      style={{ width: `${Math.min(budget.percentUsed, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {budget.percentUsed.toFixed(1)}% used
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BudgetProgressBar } from './BudgetProgressBar';
import { SpendingByCategoryChart } from './SpendingByCategoryChart';
import { CashFlowChart } from './CashFlowChart';
import { DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface BudgetDashboardProps {
  projectId: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  allocated_amount: number;
}

interface ProjectExpense {
  amount: number;
  category_id: string;
  created_at: string;
  description: string;
  expense_date: string;
  id: string;
  is_auto_generated: boolean;
  logged_by_user_id: string;
  project_id: string;
  receipt_url: string | null;
  time_entry_id: string | null;
}

export const BudgetDashboard = ({ projectId }: BudgetDashboardProps) => {
  const { data: budget, isLoading: budgetLoading } = useQuery<{
    id: string;
    total_budget: number;
    budget_categories: BudgetCategory[];
  } | null>({
    queryKey: ['budget', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_budgets')
        .select('*, budget_categories(*)')
        .eq('project_id', projectId)
        .single();
      
      if (error) throw error;
      return data as any;
    },
  });

  const { data: expenses, isLoading: expensesLoading } = useQuery<ProjectExpense[]>({
    queryKey: ['expenses', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_expenses')
        .select('*')
        .eq('project_id', projectId)
        .order('expense_date', { ascending: false });
      
      if (error) throw error;
      return data as any;
    },
  });

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('created_at')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (budgetLoading || expensesLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!budget) {
    return null;
  }

  const totalSpent = expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const remaining = budget.total_budget - totalSpent;
  const percentUsed = (totalSpent / budget.total_budget) * 100;
  
  const daysSinceStart = project ? 
    Math.max(1, Math.floor((Date.now() - new Date(project.created_at).getTime()) / (1000 * 60 * 60 * 24))) : 1;
  const burnRate = totalSpent / daysSinceStart;

  const getRemainingColor = () => {
    if (percentUsed >= 90) return 'text-destructive';
    if (percentUsed >= 75) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold">${budget.total_budget.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-destructive" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className={`text-2xl font-bold ${getRemainingColor()}`}>
                ${remaining.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {(100 - percentUsed).toFixed(1)}% left
              </p>
            </div>
            <TrendingDown className={`h-8 w-8 ${getRemainingColor()}`} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Burn Rate</p>
              <p className="text-2xl font-bold">${burnRate.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">per day</p>
            </div>
            <Clock className="h-8 w-8 text-warning" />
          </div>
        </Card>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Budget vs. Actuals</h3>
          <BudgetProgressBar 
            totalBudget={budget.total_budget} 
            totalSpent={totalSpent} 
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <SpendingByCategoryChart 
            categories={budget.budget_categories}
            expenses={expenses || []}
          />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cash Flow Over Time</h3>
        <CashFlowChart expenses={expenses || []} />
      </Card>
    </div>
  );
};

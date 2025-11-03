import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign } from 'lucide-react';
import { BudgetDashboard } from './BudgetDashboard';
import { BudgetSetup } from './BudgetSetup';
import { ExpenseForm } from './ExpenseForm';
import { TransactionLog } from './TransactionLog';

interface BudgetViewProps {
  projectId: string;
}

export const BudgetView = ({ projectId }: BudgetViewProps) => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const { data: budget, refetch: refetchBudget } = useQuery({
    queryKey: ['budget', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_budgets')
        .select('*, budget_categories(*)')
        .eq('project_id', projectId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: expenses, refetch: refetchExpenses } = useQuery({
    queryKey: ['expenses', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_expenses')
        .select('*')
        .eq('project_id', projectId)
        .order('expense_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!budget,
  });

  const handleSetupComplete = () => {
    refetchBudget();
  };

  const handleExpenseSuccess = () => {
    refetchExpenses();
    refetchBudget();
  };

  if (!budget) {
    return (
      <div className="py-8">
        <BudgetSetup projectId={projectId} onComplete={handleSetupComplete} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Budget</h2>
            <p className="text-muted-foreground">Track expenses and manage your project budget</p>
          </div>
        </div>
        <Button onClick={() => setShowExpenseForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <BudgetDashboard projectId={projectId} />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Transaction Log</h3>
        <TransactionLog 
          expenses={expenses || []} 
          categories={budget.budget_categories || []}
        />
      </div>

      <ExpenseForm
        projectId={projectId}
        categories={budget.budget_categories || []}
        open={showExpenseForm}
        onOpenChange={setShowExpenseForm}
        onSuccess={handleExpenseSuccess}
      />
    </div>
  );
};

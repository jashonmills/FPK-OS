import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';

const budgetSchema = z.object({
  totalBudget: z.string().min(1, 'Total budget is required'),
  categories: z.array(z.object({
    name: z.string().min(1, 'Category name is required'),
    amount: z.string().min(1, 'Amount is required'),
  })).min(1, 'At least one category is required'),
});

interface BudgetSetupProps {
  projectId: string;
  onComplete: () => void;
}

export const BudgetSetup = ({ projectId, onComplete }: BudgetSetupProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      totalBudget: '',
      categories: [{ name: 'Labor Costs', amount: '' }],
    },
  });

  const addCategory = () => {
    const current = form.getValues('categories');
    form.setValue('categories', [...current, { name: '', amount: '' }]);
  };

  const removeCategory = (index: number) => {
    const current = form.getValues('categories');
    if (current.length > 1) {
      form.setValue('categories', current.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (values: z.infer<typeof budgetSchema>) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const totalBudget = parseFloat(values.totalBudget);
      const categorySum = values.categories.reduce((sum, cat) => sum + parseFloat(cat.amount), 0);

      if (categorySum > totalBudget) {
        toast({
          title: 'Validation Error',
          description: 'Category allocations exceed total budget',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Create budget
      const { data: budget, error: budgetError } = await supabase
        .from('project_budgets')
        .insert({
          project_id: projectId,
          total_budget: totalBudget,
          created_by: user.id,
        })
        .select()
        .single();

      if (budgetError) throw budgetError;

      // Create categories
      const { error: categoriesError } = await supabase
        .from('budget_categories')
        .insert(
          values.categories.map(cat => ({
            budget_id: budget.id,
            name: cat.name,
            allocated_amount: parseFloat(cat.amount),
          }))
        );

      if (categoriesError) throw categoriesError;

      toast({
        title: 'Success',
        description: 'Budget created successfully',
      });

      onComplete();
    } catch (error: any) {
      console.error('Error creating budget:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create budget',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Set Up Project Budget</h2>
        <p className="text-muted-foreground mt-2">
          Define your total budget and allocate it across categories to start tracking expenses.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="totalBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Budget ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="100000" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>Budget Categories</FormLabel>
              <Button type="button" variant="outline" size="sm" onClick={addCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

            {form.watch('categories').map((_, index) => (
              <div key={index} className="flex gap-4 items-start">
                <FormField
                  control={form.control}
                  name={`categories.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      {index === 0 && <FormLabel>Name</FormLabel>}
                      <FormControl>
                        <Input placeholder="e.g., Software, Marketing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`categories.${index}.amount`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      {index === 0 && <FormLabel>Allocated Amount ($)</FormLabel>}
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="25000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCategory(index)}
                  disabled={form.watch('categories').length === 1}
                  className={index === 0 ? 'mt-8' : ''}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creating...' : 'Create Budget'}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

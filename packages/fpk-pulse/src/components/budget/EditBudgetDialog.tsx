import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { CategorySelector } from './CategorySelector';
import { Alert, AlertDescription } from '@/components/ui/alert';

const budgetSchema = z.object({
  totalBudget: z.string().min(1, 'Total budget is required'),
  categories: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Category name is required'),
    amount: z.string().min(1, 'Amount is required'),
  })).min(1, 'At least one category is required'),
});

interface BudgetCategory {
  id: string;
  name: string;
  allocated_amount: number;
}

interface EditBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetId: string;
  currentTotalBudget: number;
  currentCategories: BudgetCategory[];
  totalSpent: number;
  onSuccess: () => void;
}

export const EditBudgetDialog = ({ 
  open, 
  onOpenChange, 
  budgetId,
  currentTotalBudget,
  currentCategories,
  totalSpent,
  onSuccess 
}: EditBudgetDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      totalBudget: currentTotalBudget.toString(),
      categories: currentCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        amount: cat.allocated_amount.toString(),
      })),
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        totalBudget: currentTotalBudget.toString(),
        categories: currentCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          amount: cat.allocated_amount.toString(),
        })),
      });
      setShowWarning(false);
    }
  }, [open, currentTotalBudget, currentCategories, form]);

  // Check if new budget is less than spent
  useEffect(() => {
    const subscription = form.watch((value) => {
      const newBudget = parseFloat(value.totalBudget || '0');
      setShowWarning(newBudget < totalSpent);
    });
    return () => subscription.unsubscribe();
  }, [form, totalSpent]);

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

      // Update total budget
      const { error: budgetError } = await supabase
        .from('project_budgets')
        .update({ total_budget: totalBudget })
        .eq('id', budgetId);

      if (budgetError) throw budgetError;

      // Track which categories to update, insert, or delete
      const existingIds = currentCategories.map(c => c.id);
      const updatedIds = values.categories.filter(c => c.id).map(c => c.id!);
      const idsToDelete = existingIds.filter(id => !updatedIds.includes(id));

      // Delete removed categories
      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('budget_categories')
          .delete()
          .in('id', idsToDelete);

        if (deleteError) throw deleteError;
      }

      // Update or insert categories
      for (const cat of values.categories) {
        if (cat.id) {
          // Update existing category
          const { error: updateError } = await supabase
            .from('budget_categories')
            .update({
              name: cat.name,
              allocated_amount: parseFloat(cat.amount),
            })
            .eq('id', cat.id);

          if (updateError) throw updateError;
        } else {
          // Insert new category
          const { error: insertError } = await supabase
            .from('budget_categories')
            .insert({
              budget_id: budgetId,
              name: cat.name,
              allocated_amount: parseFloat(cat.amount),
            });

          if (insertError) throw insertError;
        }
      }

      toast({
        title: 'Success',
        description: 'Budget updated successfully',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating budget:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update budget',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
          <DialogDescription>
            Modify your total budget and category allocations. Changes will take effect immediately.
          </DialogDescription>
        </DialogHeader>

        {showWarning && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Warning: New budget (${parseFloat(form.watch('totalBudget') || '0').toLocaleString()}) is less than already spent amount (${totalSpent.toLocaleString()}).
            </AlertDescription>
          </Alert>
        )}

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
                          <CategorySelector
                            value={field.value}
                            onChange={field.onChange}
                            existingCategories={form.watch('categories').map(c => c.name).filter((_, i) => i !== index)}
                          />
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

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

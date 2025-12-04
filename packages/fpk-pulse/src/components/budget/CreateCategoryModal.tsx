import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CategorySelector } from './CategorySelector';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  allocated_amount: z.string().min(1, 'Allocated amount is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CreateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetId: string;
  projectId: string;
  totalBudget: number;
  existingAllocations: number;
  existingCategories: string[];
  onSuccess: (category: { id: string; name: string }) => void;
}

export const CreateCategoryModal = ({
  open,
  onOpenChange,
  budgetId,
  totalBudget,
  existingAllocations,
  existingCategories,
  onSuccess,
}: CreateCategoryModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      allocated_amount: '',
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);

    try {
      const allocatedAmount = parseFloat(data.allocated_amount);
      const newTotal = existingAllocations + allocatedAmount;

      if (newTotal > totalBudget) {
        toast({
          title: 'Budget Exceeded',
          description: `Total allocation ($${newTotal.toLocaleString()}) would exceed budget ($${totalBudget.toLocaleString()})`,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const { data: category, error } = await supabase
        .from('budget_categories')
        .insert({
          budget_id: budgetId,
          name: data.name,
          allocated_amount: allocatedAmount,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Category Created',
        description: `${data.name} has been added to the budget`,
      });

      form.reset();
      onSuccess(category);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create category',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Budget Category</DialogTitle>
          <DialogDescription>
            Add a new category to your project budget. Available to allocate: $
            {(totalBudget - existingAllocations).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <CategorySelector
                      value={field.value}
                      onChange={field.onChange}
                      existingCategories={existingCategories}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allocated_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allocated Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Category'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload } from 'lucide-react';

const expenseSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().min(1, 'Category is required'),
  expense_date: z.string().min(1, 'Date is required'),
});

interface ExpenseFormProps {
  projectId: string;
  categories: Array<{ id: string; name: string }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const ExpenseForm = ({ projectId, categories, open, onOpenChange, onSuccess }: ExpenseFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: '',
      description: '',
      category_id: '',
      expense_date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (values: z.infer<typeof expenseSchema>) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      let receiptUrl: string | null = null;

      // Upload receipt if provided
      if (receiptFile) {
        const fileExt = receiptFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project-receipts')
          .upload(fileName, receiptFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-receipts')
          .getPublicUrl(fileName);

        receiptUrl = publicUrl;
      }

      // Create expense
      const { error } = await supabase
        .from('project_expenses')
        .insert({
          project_id: projectId,
          category_id: values.category_id,
          amount: parseFloat(values.amount),
          description: values.description,
          expense_date: values.expense_date,
          logged_by_user_id: user.id,
          receipt_url: receiptUrl,
          is_auto_generated: false,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Expense logged successfully',
      });

      form.reset();
      setReceiptFile(null);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error logging expense:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to log expense',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Expense</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="500.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expense_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Software license renewal for Adobe Creative Cloud" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Receipt (optional)</FormLabel>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {receiptFile && (
                <p className="text-sm text-muted-foreground">{receiptFile.name}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Saving...' : 'Log Expense'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>

      {budgetData && (
        <CreateCategoryModal
          open={showCreateCategory}
          onOpenChange={setShowCreateCategory}
          budgetId={budgetData.id}
          projectId={projectId}
          totalBudget={budgetData.total_budget}
          existingAllocations={categories.reduce((sum, cat) => sum + cat.allocated_amount, 0)}
          existingCategories={categories.map(c => c.name)}
          onSuccess={(newCategory) => {
            form.setValue('category_id', newCategory.id);
            onSuccess?.();
          }}
        />
      )}
    </Dialog>
  );
};

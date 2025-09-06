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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Ban, RotateCcw } from 'lucide-react';
import { useOrganizationActions } from '@/hooks/useOrganizationActions';
import type { Organization } from '@/types/organization';

interface SuspendOrganizationDialogProps {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'suspend' | 'reactivate';
}

const suspendSchema = z.object({
  reason: z.string().min(10, 'Please provide a detailed reason (minimum 10 characters)').max(500, 'Reason too long'),
});

type SuspendFormData = z.infer<typeof suspendSchema>;

export function SuspendOrganizationDialog({ organization, open, onOpenChange, mode }: SuspendOrganizationDialogProps) {
  const { suspendOrganization, reactivateOrganization } = useOrganizationActions();
  
  const form = useForm<SuspendFormData>({
    resolver: zodResolver(suspendSchema),
    defaultValues: {
      reason: '',
    },
  });

  const isSuspend = mode === 'suspend';
  const isLoading = suspendOrganization.isPending || reactivateOrganization.isPending;

  const onSubmit = async (data: SuspendFormData) => {
    try {
      if (isSuspend) {
        await suspendOrganization.mutateAsync({
          id: organization.id,
          data: { reason: data.reason }
        });
      } else {
        await reactivateOrganization.mutateAsync(organization.id);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-background border border-border">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isSuspend ? 'text-warning' : 'text-success'}`}>
            {isSuspend ? <Ban className="h-5 w-5" /> : <RotateCcw className="h-5 w-5" />}
            {isSuspend ? 'Suspend Organization' : 'Reactivate Organization'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isSuspend 
              ? 'Temporarily disable access to this organization. Members will not be able to log in or access resources.'
              : 'Restore full access to this organization and all its members.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="font-medium text-foreground mb-2">Organization Details:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><span className="font-medium">Name:</span> {organization.name}</p>
                  <p><span className="font-medium">Members:</span> {organization.seats_used} / {organization.seat_limit}</p>
                  <p><span className="font-medium">Current Status:</span> 
                    <span className={`ml-1 capitalize ${
                      organization.status === 'active' ? 'text-success' : 
                      organization.status === 'suspended' ? 'text-warning' : 'text-destructive'
                    }`}>
                      {organization.status}
                    </span>
                  </p>
                  {organization.suspended_reason && (
                    <p><span className="font-medium">Last Suspension Reason:</span> {organization.suspended_reason}</p>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      {isSuspend ? 'Reason for Suspension' : 'Reason for Reactivation'}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={isSuspend 
                          ? "Explain why this organization is being suspended..." 
                          : "Explain why this organization is being reactivated..."
                        }
                        rows={4}
                        {...field}
                        className="bg-input border-border text-foreground resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isSuspend && (
                <div className="rounded-lg border border-warning/20 bg-warning/5 p-4">
                  <h4 className="font-medium text-warning mb-2">Effects of Suspension:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Members will be logged out and cannot log back in</li>
                    <li>• All organization data will be preserved</li>
                    <li>• Billing will continue (manual adjustment needed)</li>
                    <li>• Organization owner will be notified via email</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="border-border text-muted-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                variant={isSuspend ? "destructive" : "default"}
                className={isSuspend 
                  ? "bg-warning text-warning-foreground hover:bg-warning/90" 
                  : "bg-success text-success-foreground hover:bg-success/90"
                }
              >
                {isLoading 
                  ? (isSuspend ? 'Suspending...' : 'Reactivating...') 
                  : (isSuspend ? 'Suspend Organization' : 'Reactivate Organization')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
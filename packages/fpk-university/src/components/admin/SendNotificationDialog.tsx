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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Users, AlertCircle, Info } from 'lucide-react';
import { useOrganizationActions } from '@/hooks/useOrganizationActions';
import type { Organization } from '@/types/organization';

interface SendNotificationDialogProps {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const notificationSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject too long'),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000, 'Message too long'),
  notification_type: z.enum(['general', 'maintenance', 'update', 'billing', 'urgent']),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

export function SendNotificationDialog({ organization, open, onOpenChange }: SendNotificationDialogProps) {
  const { sendNotification } = useOrganizationActions();
  
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      subject: '',
      message: '',
      notification_type: 'general',
    },
  });

  const onSubmit = async (data: NotificationFormData) => {
    try {
      await sendNotification.mutateAsync({
        organizationId: organization.id,
        data: {
          subject: data.subject,
          message: data.message,
          notification_type: data.notification_type,
        }
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const notificationTypes = [
    { value: 'general', label: 'General', icon: Info, description: 'General announcements and updates' },
    { value: 'maintenance', label: 'Maintenance', icon: AlertCircle, description: 'System maintenance notifications' },
    { value: 'update', label: 'Feature Update', icon: Info, description: 'New features and improvements' },
    { value: 'billing', label: 'Billing', icon: AlertCircle, description: 'Billing and payment related' },
    { value: 'urgent', label: 'Urgent', icon: AlertCircle, description: 'Urgent notifications requiring immediate attention' },
  ];

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Mail className="h-5 w-5" />
            Send Notification
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Send an email notification to all members of this organization.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium text-foreground">Recipients</h4>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><span className="font-medium">Organization:</span> {organization.name}</p>
                  <p><span className="font-medium">Active Members:</span> {organization.seats_used}</p>
                  <p className="text-xs mt-1 text-muted-foreground">
                    All active members will receive this notification via email
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="notification_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Notification Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border text-foreground">
                          <SelectValue placeholder="Select notification type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background border border-border">
                        {notificationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="hover:bg-muted">
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-muted-foreground">{type.description}</div>
                              </div>
                            </div>
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
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Subject</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter email subject" 
                        {...field} 
                        className="bg-input border-border text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your message here..."
                        rows={8}
                        {...field}
                        className="bg-input border-border text-foreground resize-none"
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Minimum 20 characters</span>
                      <span>{field.value?.length || 0} / 2000</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-lg border border-info/20 bg-info/5 p-4">
                <h4 className="font-medium text-info mb-2">Delivery Information:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Notifications are sent immediately after confirmation</li>
                  <li>• Recipients will see this came from FPK University administration</li>
                  <li>• Delivery status will be tracked and logged</li>
                  <li>• Members can unsubscribe from non-urgent notifications</li>
                </ul>
              </div>
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
                disabled={sendNotification.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {sendNotification.isPending ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
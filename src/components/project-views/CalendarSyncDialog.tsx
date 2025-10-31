import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Copy, RefreshCw, CalendarDays } from 'lucide-react';

interface CalendarSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  myTasksOnly?: boolean;
}

export const CalendarSyncDialog = ({ open, onOpenChange, projectId, myTasksOnly }: CalendarSyncDialogProps) => {
  const [subscriptionUrl, setSubscriptionUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchOrCreateSubscription();
    }
  }, [open, projectId, myTasksOnly]);

  const fetchOrCreateSubscription = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if subscription already exists
      const { data: existing } = await supabase
        .from('calendar_subscriptions')
        .select('token')
        .eq('user_id', user.id)
        .maybeSingle();

      let token: string;

      if (existing) {
        token = existing.token;
        
        // Update filter settings
        await supabase
          .from('calendar_subscriptions')
          .update({
            filter_settings: {
              project_id: projectId || null,
              my_tasks_only: myTasksOnly || false,
            },
          })
          .eq('user_id', user.id);
      } else {
        // Create new subscription
        token = generateToken();
        
        const { error: insertError } = await supabase
          .from('calendar_subscriptions')
          .insert({
            user_id: user.id,
            token,
            filter_settings: {
              project_id: projectId || null,
              my_tasks_only: myTasksOnly || false,
            },
          });

        if (insertError) throw insertError;
      }

      const baseUrl = import.meta.env.VITE_SUPABASE_URL;
      const url = `${baseUrl}/functions/v1/generate-calendar-feed?token=${token}`;
      setSubscriptionUrl(url);
    } catch (error) {
      console.error('Error managing subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate calendar URL',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateToken = () => {
    return crypto.randomUUID();
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(subscriptionUrl);
      toast({
        title: 'Copied!',
        description: 'Calendar URL copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy URL',
        variant: 'destructive',
      });
    }
  };

  const handleRegenerateUrl = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const newToken = generateToken();

      const { error } = await supabase
        .from('calendar_subscriptions')
        .update({
          token: newToken,
          filter_settings: {
            project_id: projectId || null,
            my_tasks_only: myTasksOnly || false,
          },
        })
        .eq('user_id', user.id);

      if (error) throw error;

      const baseUrl = import.meta.env.VITE_SUPABASE_URL;
      const url = `${baseUrl}/functions/v1/generate-calendar-feed?token=${newToken}`;
      setSubscriptionUrl(url);

      toast({
        title: 'Success',
        description: 'Calendar URL regenerated. Your old URL is no longer valid.',
      });
    } catch (error) {
      console.error('Error regenerating URL:', error);
      toast({
        title: 'Error',
        description: 'Failed to regenerate URL',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Sync to Calendar
          </DialogTitle>
          <DialogDescription>
            Subscribe to your FPK Pulse tasks in Google Calendar, Outlook, or any other calendar app that supports iCal subscriptions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Calendar Subscription URL</label>
            <div className="flex gap-2">
              <Input
                value={subscriptionUrl}
                readOnly
                className="flex-1 font-mono text-xs"
                placeholder={loading ? 'Generating...' : 'Calendar URL will appear here'}
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopyUrl}
                disabled={!subscriptionUrl || loading}
                title="Copy URL"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">How to use:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Copy the URL above</li>
              <li>Open your calendar app (Google Calendar, Outlook, etc.)</li>
              <li>Look for "Add calendar" or "Subscribe to calendar"</li>
              <li>Choose "From URL" or "From web"</li>
              <li>Paste the URL and save</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">
              Your calendar will automatically update with task changes from FPK Pulse.
            </p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerateUrl}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate URL
            </Button>
            <p className="text-xs text-muted-foreground">
              Regenerate if you think your URL has been compromised
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useCleanup } from '@/utils/cleanupManager';

interface SyncResult {
  goalId: string;
  status: 'created' | 'updated' | 'error';
  eventId?: string;
  error?: string;
}

interface Goal {
  id: string;
  title: string;
  target_date?: string | null;
  description?: string;
  [key: string]: unknown;
}

export function useGoogleCalendarSync() {
  const cleanup = useCleanup('google-calendar-sync');
  const { session } = useAuth();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const checkConnection = useCallback(async () => {
    if (!session?.user) return false;

    try {
      const { data, error } = await supabase
        .from('google_oauth_tokens')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      const connected = !error && !!data;
      setIsConnected(connected);
      return connected;
    } catch (error) {
      console.error('Error checking Google Calendar connection:', error);
      return false;
    }
  }, [session?.user]);

  const connectCalendar = useCallback(async () => {
    if (!session?.access_token) {
      toast({
        title: "Error",
        description: "Please log in to connect Google Calendar",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Get OAuth URL
      const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
        body: { action: 'get-auth-url' },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Open OAuth flow in new window
      const popup = window.open(
        data.authUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for OAuth completion using cleanupManager
      const checkClosedId = cleanup.setInterval(() => {
        if (popup?.closed) {
          cleanup.cleanup(checkClosedId);
          // Check if connection was successful
          cleanup.setTimeout(async () => {
            const connected = await checkConnection();
            if (connected) {
              toast({
                title: "Success!",
                description: "Google Calendar connected successfully",
              });
            }
            setIsConnecting(false);
          }, 1000);
        }
      }, 1000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect Google Calendar";
      console.error('Error connecting Google Calendar:', error);
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  }, [session?.access_token, toast, checkConnection]);

  const disconnectCalendar = useCallback(async () => {
    if (!session?.access_token) return;

    try {
      const { error } = await supabase.functions.invoke('google-calendar-sync', {
        body: { action: 'disconnect' },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setIsConnected(false);
      toast({
        title: "Disconnected",
        description: "Google Calendar has been disconnected",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to disconnect Google Calendar";
      console.error('Error disconnecting Google Calendar:', error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [session?.access_token, toast]);

  const syncGoals = useCallback(async (goals: Goal[]) => {
    if (!session?.access_token) return;

    setIsSyncing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
        body: { 
          action: 'sync-goals',
          goals: goals.filter(goal => goal.target_date) // Only sync goals with target dates
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      const results: SyncResult[] = data.syncResults;
      const successCount = results.filter(r => r.status !== 'error').length;
      const errorCount = results.filter(r => r.status === 'error').length;

      if (successCount > 0) {
        toast({
          title: "Sync Complete",
          description: `${successCount} goal(s) synced to Google Calendar${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
        });
      }

      if (errorCount > 0) {
        console.error('Sync errors:', results.filter(r => r.status === 'error'));
      }

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sync goals to Google Calendar";
      console.error('Error syncing goals:', error);
      toast({
        title: "Sync Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [session?.access_token, toast]);

  return {
    isConnected,
    isConnecting,
    isSyncing,
    connectCalendar,
    disconnectCalendar,
    syncGoals,
    checkConnection,
  };
}
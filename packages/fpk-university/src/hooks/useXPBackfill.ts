
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface BackfillResult {
  user_id: string;
  before_xp: number;
  after_xp: number;
  before_level: number;
  after_level: number;
  events_created: number;
  badges_awarded: string[];
  activities_processed: {
    flashcards: number;
    study_sessions: number;
    notes: number;
    goals: number;
    reading_sessions: number;
    file_uploads: number;
  };
}

interface DryRunResult {
  dry_run: true;
  user_id: string;
  before_xp: number;
  projected_after_xp: number;
  before_level: number;
  projected_after_level: number;
  events_to_create: number;
  backfill_xp: number;
  activities_found: {
    flashcards: number;
    study_sessions: number;
    notes: number;
    goals: number;
    reading_sessions: number;
    file_uploads: number;
  };
}

interface BackfillReport {
  user_id: string;
  current_xp: number;
  current_level: number;
  total_events: number;
  backfill_events: number;
  regular_events: number;
  backfill_xp: number;
  regular_xp: number;
  badges_earned: number;
  recent_events: any[];
}

type BackfillResponse = BackfillResult | DryRunResult;

export function useXPBackfill() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [backfillResult, setBackfillResult] = useState<BackfillResponse | null>(null);
  const [backfillReport, setBackfillReport] = useState<BackfillReport | null>(null);
  const { user } = useAuth();

  const runBackfill = useCallback(async (dryRun: boolean = false, targetUserId?: string) => {
    if (!user?.id && !targetUserId) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('xp-backfill', {
        body: {
          action: 'backfill_xp',
          dry_run: dryRun,
          user_id: targetUserId
        }
      });

      if (error) throw error;

      setBackfillResult(data);

      if (dryRun) {
        toast({
          title: "Dry Run Complete",
          description: `Would award ${data.backfill_xp} XP and create ${data.events_to_create} events`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Backfill Complete!",
          description: `Awarded ${data.after_xp - data.before_xp} XP and ${data.badges_awarded.length} badges`,
          duration: 5000,
        });
      }

      return data;
    } catch (error) {
      console.error('Backfill failed:', error);
      toast({
        title: "Backfill Failed",
        description: "Failed to process XP backfill. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id]);

  const runBackfillForAllUsers = useCallback(async (dryRun: boolean = false) => {
    if (!user?.id) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('xp-backfill', {
        body: {
          action: 'backfill_all_users',
          dry_run: dryRun
        }
      });

      if (error) throw error;

      toast({
        title: dryRun ? "All Users Dry Run Complete" : "All Users Backfill Complete!",
        description: `Processed ${data.users_processed} users, ${dryRun ? 'would award' : 'awarded'} ${data.total_xp_awarded} total XP`,
        duration: 5000,
      });

      return data;
    } catch (error) {
      console.error('All users backfill failed:', error);
      toast({
        title: "Backfill Failed",
        description: "Failed to process backfill for all users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id]);

  const rollbackBackfill = useCallback(async (targetUserId?: string) => {
    if (!user?.id && !targetUserId) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('xp-backfill', {
        body: {
          action: 'rollback_backfill',
          user_id: targetUserId
        }
      });

      if (error) throw error;

      toast({
        title: "Rollback Complete",
        description: `Removed ${data.events_deleted} backfill events`,
        duration: 3000,
      });

      setBackfillResult(null);
      return data;
    } catch (error) {
      console.error('Rollback failed:', error);
      toast({
        title: "Rollback Failed",
        description: "Failed to rollback backfill. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id]);

  const getBackfillReport = useCallback(async (targetUserId?: string) => {
    if (!user?.id && !targetUserId) return;

    try {
      const { data, error } = await supabase.functions.invoke('xp-backfill', {
        body: {
          action: 'get_backfill_report',
          user_id: targetUserId
        }
      });

      if (error) throw error;

      setBackfillReport(data);
      return data;
    } catch (error) {
      console.error('Failed to get backfill report:', error);
      toast({
        title: "Report Failed",
        description: "Failed to generate backfill report. Please try again.",
        variant: "destructive"
      });
    }
  }, [user?.id]);

  return {
    runBackfill,
    runBackfillForAllUsers,
    rollbackBackfill,
    getBackfillReport,
    backfillResult,
    backfillReport,
    isProcessing
  };
}

import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeOptions {
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  schema?: string;
  table: string;
  filter?: string;
}

export function useRealtimeChannel(
  channelName: string,
  options: RealtimeOptions,
  callback: (payload: any) => void
) {
  const cbRef = useRef(callback);
  const channelRef = useRef<RealtimeChannel | null>(null);
  cbRef.current = callback;

  useEffect(() => {
    // Clean up existing channel if any
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as any,
        {
          event: options.event || '*',
          schema: options.schema || 'public',
          table: options.table,
          filter: options.filter,
        },
        (payload) => cbRef.current(payload)
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.debug(`✅ [RT] subscribed → ${options.table}.${options.event || '*'}`);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          console.warn(`❌ [RT] ${status} → ${options.table}.${options.event || '*'}`);
        }
      });

    channelRef.current = channel;

    // Reconnect logic on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && channelRef.current) {
        // Only resubscribe if the channel exists but isn't connected
        const currentState = channelRef.current.state;
        if (currentState === 'closed' || currentState === 'errored') {
          console.debug(`🔄 [RT] reconnecting → ${options.table}`);
          channelRef.current.subscribe();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [channelName, options.table, options.event, options.filter, options.schema]);
}
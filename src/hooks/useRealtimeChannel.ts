import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { channelRegistry } from '@/utils/realtimeChannelRegistry';

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
  // Critical validation: ensure all required parameters are valid
  if (!channelName || typeof channelName !== 'string' || !options?.table || typeof options.table !== 'string') {
    console.warn('Invalid parameters for useRealtimeChannel:', { channelName, options });
    return;
  }
  
  const cbRef = useRef(callback);
  const channelRef = useRef<RealtimeChannel | null>(null);
  cbRef.current = callback;

  useEffect(() => {
    // Clean up existing channel if any
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    // Use registry to prevent duplicates
    const channel = channelRegistry.getOrCreateChannel(channelName, () => {
      return supabase
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
        );
    });

    // Subscribe with health monitoring
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.debug(`✅ [RT] subscribed → ${options.table}.${options.event || '*'}`);
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        console.warn(`❌ [RT] ${status} → ${options.table}.${options.event || '*'}`);
        // Auto-cleanup on error
        channelRegistry.removeChannel(channelName);
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
        console.debug(`🔌 Cleaning up channel: ${channelName}`);
        channelRegistry.removeChannel(channelName);
        channelRef.current = null;
      }
    };
  }, [channelName, options.table, options.event, options.filter, options.schema]);
}
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
  // Critical validation: ensure all required parameters are valid
  if (!channelName || typeof channelName !== 'string' || !options?.table || typeof options.table !== 'string') {
    console.warn('Invalid parameters for useRealtimeChannel:', { channelName, options });
    return;
  }
  
  const cbRef = useRef(callback);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isSubscribedRef = useRef(false);
  
  // Update callback reference
  cbRef.current = callback;

  useEffect(() => {
    // Prevent multiple subscriptions
    if (isSubscribedRef.current) {
      return;
    }

    // Clean up existing channel if any
    if (channelRef.current) {
      try {
        channelRef.current.unsubscribe();
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.warn('Error cleaning up channel:', error);
      }
      channelRef.current = null;
    }

    // Create new channel
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
        (payload) => {
          if (cbRef.current) {
            cbRef.current(payload);
          }
        }
      );

    // Subscribe once
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.debug(`✅ [RT] subscribed → ${options.table}.${options.event || '*'}`);
        isSubscribedRef.current = true;
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        console.warn(`❌ [RT] ${status} → ${options.table}.${options.event || '*'}`);
        isSubscribedRef.current = false;
      }
    });

    channelRef.current = channel;

    return () => {
      console.debug(`🔌 Cleaning up channel: ${channelName}`);
      isSubscribedRef.current = false;
      if (channelRef.current) {
        try {
          channelRef.current.unsubscribe();
          supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.warn('Error during cleanup:', error);
        }
        channelRef.current = null;
      }
    };
  }, [channelName, options.table, options.event, options.filter, options.schema]);
}
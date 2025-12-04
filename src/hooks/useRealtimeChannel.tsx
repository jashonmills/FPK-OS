import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeChannelConfig {
  event: '*' | 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema?: string;
  filter?: string;
}

export function useRealtimeChannel(
  channelName: string,
  config: RealtimeChannelConfig,
  onUpdate: (payload: any) => void
) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    // Create channel
    const channel = supabase.channel(channelName);

    // Subscribe to postgres changes
    channel.on(
      'postgres_changes',
      {
        event: config.event,
        schema: config.schema || 'public',
        table: config.table,
        filter: config.filter,
      },
      (payload) => {
        console.log(`[Realtime] ${channelName} event:`, payload.eventType, payload.new || payload.old);
        onUpdate(payload);
      }
    );

    // Subscribe to channel
    channel.subscribe((status) => {
      console.log(`[Realtime] ${channelName} status:`, status);
    });

    channelRef.current = channel;

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        console.log(`[Realtime] Unsubscribing from ${channelName}`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [channelName, config.event, config.table, config.schema, config.filter]);
}

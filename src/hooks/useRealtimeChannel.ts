import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeOptions {
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  schema?: string;
  table: string;
  filter?: string;
}

// Global registry to prevent duplicate subscriptions
const globalChannels = new Map<string, RealtimeChannel>();
const globalCallbacks = new Map<string, Set<(payload: any) => void>>();

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
  const channelKeyRef = useRef(`${channelName}-${options.table}-${options.event || '*'}-${options.filter || ''}`);
  
  // Update callback reference
  cbRef.current = callback;

  useEffect(() => {
    const channelKey = channelKeyRef.current;
    
    // Add callback to global registry
    if (!globalCallbacks.has(channelKey)) {
      globalCallbacks.set(channelKey, new Set());
    }
    globalCallbacks.get(channelKey)!.add(cbRef.current);
    
    // Create channel only if it doesn't exist
    if (!globalChannels.has(channelKey)) {
      console.debug(`🆕 Creating new shared channel: ${channelKey}`);
      
      const channel = supabase
        .channel(channelKey)
        .on(
          'postgres_changes' as any,
          {
            event: options.event || '*',
            schema: options.schema || 'public',
            table: options.table,
            filter: options.filter,
          },
          (payload) => {
            // Notify all callbacks for this channel
            const callbacks = globalCallbacks.get(channelKey);
            if (callbacks) {
              callbacks.forEach(cb => {
                try {
                  cb(payload);
                } catch (error) {
                  console.error('Error in realtime callback:', error);
                }
              });
            }
          }
        );

      // Subscribe once
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.debug(`✅ [RT] subscribed → ${options.table}.${options.event || '*'}`);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          console.warn(`❌ [RT] ${status} → ${options.table}.${options.event || '*'}`);
          // Clean up failed channel
          globalChannels.delete(channelKey);
          globalCallbacks.delete(channelKey);
        }
      });

      globalChannels.set(channelKey, channel);
    } else {
      console.debug(`♻️ Reusing existing channel: ${channelKey}`);
    }

    return () => {
      const channelKey = channelKeyRef.current;
      console.debug(`🔌 Cleaning up callback for: ${channelKey}`);
      
      // Remove callback from global registry
      const callbacks = globalCallbacks.get(channelKey);
      if (callbacks) {
        callbacks.delete(cbRef.current);
        
        // If no more callbacks, clean up the channel
        if (callbacks.size === 0) {
          console.debug(`🗑️ Removing unused channel: ${channelKey}`);
          const channel = globalChannels.get(channelKey);
          if (channel) {
            try {
              channel.unsubscribe();
              supabase.removeChannel(channel);
            } catch (error) {
              console.warn('Error during cleanup:', error);
            }
          }
          globalChannels.delete(channelKey);
          globalCallbacks.delete(channelKey);
        }
      }
    };
  }, [channelKeyRef.current]);
}
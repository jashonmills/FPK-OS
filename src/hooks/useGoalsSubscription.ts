
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UseGoalsSubscriptionProps {
  onGoalsChange: () => void;
}

export const useGoalsSubscription = ({ onGoalsChange }: UseGoalsSubscriptionProps) => {
  const { user } = useAuth();
  const channelRef = useRef<any>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    console.log('🔗 Setting up goals real-time subscription for user:', user.id);

    // Clean up any existing channel
    if (channelRef.current) {
      console.log('🧹 Cleaning up existing goals channel');
      try {
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.log('Error removing existing channel:', error);
      }
      channelRef.current = null;
    }

    // Create a unique channel name with timestamp to avoid conflicts
    const channelName = `goals-${user.id}-${Date.now()}`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false }
      }
    });

    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'goals',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        if (!mountedRef.current) return;
        console.log('Real-time goal update:', payload);
        onGoalsChange();
      }
    );

    channel.subscribe((status) => {
      console.log('Goals channel subscription status:', status);
      if (status === 'SUBSCRIBED') {
        console.log('✅ Goals channel successfully subscribed');
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        console.log('❌ Goals channel closed or error');
      }
    });

    // Store the channel reference
    channelRef.current = channel;

    // Cleanup function
    return () => {
      if (channelRef.current) {
        console.log('🧹 Cleaning up goals channel on unmount');
        try {
          supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.log('Error removing channel on cleanup:', error);
        }
        channelRef.current = null;
      }
    };
  }, [user?.id, onGoalsChange]);
};

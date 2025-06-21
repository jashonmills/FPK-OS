
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UseGoalsSubscriptionProps {
  onGoalsChange: () => void;
}

export const useGoalsSubscription = ({ onGoalsChange }: UseGoalsSubscriptionProps) => {
  const { user } = useAuth();
  const channelRef = useRef<any>(null);
  const callbackRef = useRef(onGoalsChange);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = onGoalsChange;
  }, [onGoalsChange]);

  useEffect(() => {
    if (!user?.id) {
      console.log('🔗 No user found, skipping goals subscription');
      return;
    }

    // Clean up existing subscription
    if (channelRef.current) {
      console.log('🧹 Cleaning up existing goals subscription');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log('🔗 Setting up goals subscription for user:', user.id);
    
    const channel = supabase.channel(`goals-${user.id}-${Date.now()}`, {
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
        console.log('📡 Real-time goal update received:', payload);
        callbackRef.current();
      }
    );

    channel.subscribe((status) => {
      console.log('📡 Goals subscription status:', status);
    });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log('🧹 Cleaning up goals subscription on unmount');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]);
};

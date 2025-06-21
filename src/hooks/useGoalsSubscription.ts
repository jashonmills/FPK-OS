
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UseGoalsSubscriptionProps {
  onGoalsChange: () => void;
}

// Global subscription manager to prevent multiple subscriptions
class GoalsSubscriptionManager {
  private static instance: GoalsSubscriptionManager;
  private currentChannel: any = null;
  private currentUserId: string | null = null;
  private subscribers: Set<() => void> = new Set();

  static getInstance(): GoalsSubscriptionManager {
    if (!GoalsSubscriptionManager.instance) {
      GoalsSubscriptionManager.instance = new GoalsSubscriptionManager();
    }
    return GoalsSubscriptionManager.instance;
  }

  subscribe(userId: string, callback: () => void) {
    this.subscribers.add(callback);
    
    // If we already have a subscription for this user, just add the callback
    if (this.currentChannel && this.currentUserId === userId) {
      console.log('🔗 Reusing existing goals subscription for user:', userId);
      return;
    }

    // Clean up existing subscription if user changed
    if (this.currentChannel && this.currentUserId !== userId) {
      console.log('🧹 Cleaning up subscription for different user');
      this.cleanup();
    }

    this.setupSubscription(userId);
  }

  unsubscribe(callback: () => void) {
    this.subscribers.delete(callback);
    
    // If no more subscribers, clean up the subscription
    if (this.subscribers.size === 0) {
      console.log('🧹 No more subscribers, cleaning up goals subscription');
      this.cleanup();
    }
  }

  private setupSubscription(userId: string) {
    if (this.currentChannel) {
      return; // Already have a subscription
    }

    console.log('🔗 Setting up new goals subscription for user:', userId);
    
    const channelName = `goals-global-${userId}`;
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
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time goal update:', payload);
        // Notify all subscribers
        this.subscribers.forEach(callback => callback());
      }
    );

    channel.subscribe((status) => {
      console.log('Goals channel subscription status:', status);
      if (status === 'SUBSCRIBED') {
        console.log('✅ Goals channel successfully subscribed');
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        console.log('❌ Goals channel closed or error');
        this.cleanup();
      }
    });

    this.currentChannel = channel;
    this.currentUserId = userId;
  }

  private cleanup() {
    if (this.currentChannel) {
      console.log('🧹 Cleaning up goals subscription channel');
      try {
        supabase.removeChannel(this.currentChannel);
      } catch (error) {
        console.log('Error removing channel:', error);
      }
      this.currentChannel = null;
      this.currentUserId = null;
    }
  }
}

export const useGoalsSubscription = ({ onGoalsChange }: UseGoalsSubscriptionProps) => {
  const { user } = useAuth();
  const manager = useRef(GoalsSubscriptionManager.getInstance());
  const callbackRef = useRef(onGoalsChange);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = onGoalsChange;
  }, [onGoalsChange]);

  useEffect(() => {
    if (!user?.id) return;

    const stableCallback = () => callbackRef.current();
    
    manager.current.subscribe(user.id, stableCallback);

    return () => {
      manager.current.unsubscribe(stableCallback);
    };
  }, [user?.id]);
};

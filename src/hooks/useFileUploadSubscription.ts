
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { RealtimeChannel } from '@supabase/supabase-js';

interface FileUploadUpdateHandler {
  id: string;
  handler: (payload: any) => void;
}

interface FileUploadSubscriptionService {
  subscribe: (id: string, handler: (payload: any) => void) => void;
  unsubscribe: (id: string) => void;
  isConnected: boolean;
}

let globalChannel: RealtimeChannel | null = null;
let globalHandlers: FileUploadUpdateHandler[] = [];
let globalUserId: string | null = null;
let isSubscribing = false;

export const useFileUploadSubscription = (): FileUploadSubscriptionService => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const handlersRef = useRef<FileUploadUpdateHandler[]>([]);

  const subscribe = useCallback((id: string, handler: (payload: any) => void) => {
    console.log(`📡 Subscribing handler: ${id}`);
    
    // Add to local handlers
    handlersRef.current.push({ id, handler });
    
    // Add to global handlers
    globalHandlers.push({ id, handler });
    
    // Initialize connection if needed
    initializeConnection();
  }, []);

  const unsubscribe = useCallback((id: string) => {
    console.log(`📡 Unsubscribing handler: ${id}`);
    
    // Remove from local handlers
    handlersRef.current = handlersRef.current.filter(h => h.id !== id);
    
    // Remove from global handlers
    globalHandlers = globalHandlers.filter(h => h.id !== id);
    
    // Clean up connection if no handlers left
    if (globalHandlers.length === 0) {
      cleanupConnection();
    }
  }, []);

  const initializeConnection = useCallback(() => {
    if (!user?.id || isSubscribing || globalChannel) return;
    if (globalUserId === user.id && globalChannel) return;

    console.log('📡 Initializing file upload subscription connection');
    isSubscribing = true;

    // Clean up previous connection if user changed
    if (globalChannel && globalUserId !== user.id) {
      console.log('📡 Cleaning up previous connection for user change');
      supabase.removeChannel(globalChannel);
      globalChannel = null;
    }

    globalUserId = user.id;

    const channelName = `global-file-uploads-${user.id}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'file_uploads',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📡 Broadcasting file upload update to all handlers:', payload);
          
          // Notify all registered handlers
          globalHandlers.forEach(({ id, handler }) => {
            try {
              handler(payload);
            } catch (error) {
              console.error(`📡 Error in handler ${id}:`, error);
            }
          });
        }
      );

    globalChannel = channel;

    channel.subscribe((status) => {
      isSubscribing = false;
      if (status === 'SUBSCRIBED') {
        console.log('✅ Global file upload subscription connected');
        setIsConnected(true);
      } else {
        console.error('❌ Failed to connect global file upload subscription:', status);
        setIsConnected(false);
        globalChannel = null;
        globalUserId = null;
      }
    });
  }, [user?.id]);

  const cleanupConnection = useCallback(() => {
    console.log('📡 Cleaning up global file upload connection');
    if (globalChannel) {
      supabase.removeChannel(globalChannel);
      globalChannel = null;
      globalUserId = null;
      setIsConnected(false);
    }
  }, []);

  // Initialize connection when user changes
  useEffect(() => {
    if (user?.id) {
      initializeConnection();
    }
    
    return () => {
      // Clean up local handlers on unmount
      handlersRef.current.forEach(({ id }) => {
        globalHandlers = globalHandlers.filter(h => h.id !== id);
      });
      
      // Clean up connection if no handlers left
      if (globalHandlers.length === 0) {
        cleanupConnection();
      }
    };
  }, [user?.id]);

  return {
    subscribe,
    unsubscribe,
    isConnected
  };
};

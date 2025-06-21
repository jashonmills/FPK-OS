
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
  startPolling: (uploadId: string, callback: (upload: any) => void) => void;
  stopPolling: (uploadId: string) => void;
}

// Global state management with better cleanup
let globalChannel: RealtimeChannel | null = null;
let globalHandlers: FileUploadUpdateHandler[] = [];
let globalUserId: string | null = null;
let isSubscribing = false;
let isChannelSubscribed = false;
let pollingIntervals: Record<string, NodeJS.Timeout> = {};
let subscriptionAttempts = 0;
const MAX_SUBSCRIPTION_ATTEMPTS = 3;

export const useFileUploadSubscription = (): FileUploadSubscriptionService => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const handlersRef = useRef<FileUploadUpdateHandler[]>([]);
  const mountedRef = useRef(true);

  const subscribe = useCallback((id: string, handler: (payload: any) => void) => {
    if (!mountedRef.current) return;
    
    console.log(`📡 Subscribing handler: ${id}`);
    
    // Check if handler already exists
    const existingHandler = globalHandlers.find(h => h.id === id);
    if (existingHandler) {
      console.log(`📡 Handler ${id} already exists, updating`);
      existingHandler.handler = handler;
      return;
    }
    
    // Add to local handlers
    const newHandler = { id, handler };
    handlersRef.current.push(newHandler);
    
    // Add to global handlers
    globalHandlers.push(newHandler);
    
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

  const startPolling = useCallback((uploadId: string, callback: (upload: any) => void) => {
    if (!mountedRef.current) return;
    
    console.log(`🔄 Starting polling for upload: ${uploadId}`);
    
    if (pollingIntervals[uploadId]) {
      clearInterval(pollingIntervals[uploadId]);
    }

    const pollInterval = setInterval(async () => {
      if (!mountedRef.current) {
        clearInterval(pollingIntervals[uploadId]);
        delete pollingIntervals[uploadId];
        return;
      }

      try {
        const { data, error } = await supabase
          .from('file_uploads')
          .select('*')
          .eq('id', uploadId)
          .single();

        if (error) {
          console.error('❌ Polling error:', error);
          return;
        }

        if (data && (data.processing_status === 'completed' || data.processing_status === 'failed')) {
          console.log(`✅ Polling complete for ${uploadId}: ${data.processing_status}`);
          callback(data);
          clearInterval(pollingIntervals[uploadId]);
          delete pollingIntervals[uploadId];
        }
      } catch (error) {
        console.error('❌ Polling fetch error:', error);
      }
    }, 3000);

    pollingIntervals[uploadId] = pollInterval;

    // Auto cleanup after 5 minutes
    setTimeout(() => {
      if (pollingIntervals[uploadId]) {
        console.log(`⏰ Polling timeout for ${uploadId}`);
        clearInterval(pollingIntervals[uploadId]);
        delete pollingIntervals[uploadId];
      }
    }, 300000);
  }, []);

  const stopPolling = useCallback((uploadId: string) => {
    if (pollingIntervals[uploadId]) {
      console.log(`🛑 Stopping polling for ${uploadId}`);
      clearInterval(pollingIntervals[uploadId]);
      delete pollingIntervals[uploadId];
    }
  }, []);

  const initializeConnection = useCallback(() => {
    if (!user?.id || isSubscribing || isChannelSubscribed || !mountedRef.current) return;
    if (globalUserId === user.id && globalChannel && isChannelSubscribed) return;
    if (subscriptionAttempts >= MAX_SUBSCRIPTION_ATTEMPTS) {
      console.log('📡 Max subscription attempts reached, using polling fallback');
      return;
    }

    console.log('📡 Initializing file upload subscription connection');
    isSubscribing = true;
    subscriptionAttempts++;

    try {
      // Clean up previous connection if user changed
      if (globalChannel && globalUserId !== user.id) {
        console.log('📡 Cleaning up previous connection for user change');
        try {
          supabase.removeChannel(globalChannel);
          isChannelSubscribed = false;
        } catch (error) {
          console.error('Error removing channel:', error);
        }
        globalChannel = null;
      }

      globalUserId = user.id;

      const channelName = `file-uploads-${user.id}-${Date.now()}`;
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
            if (!mountedRef.current) return;
            
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
          console.log('✅ File upload subscription connected');
          isChannelSubscribed = true;
          subscriptionAttempts = 0; // Reset on success
          if (mountedRef.current) {
            setIsConnected(true);
          }
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          console.error('❌ Real-time connection failed:', status);
          isChannelSubscribed = false;
          if (mountedRef.current) {
            setIsConnected(false);
          }
          globalChannel = null;
          globalUserId = null;
          
          // Fallback: Start polling for all pending uploads
          console.log('🔄 Falling back to polling mode');
          setTimeout(async () => {
            if (!mountedRef.current || !user?.id) return;
            
            try {
              const { data: pendingUploads } = await supabase
                .from('file_uploads')
                .select('*')
                .eq('user_id', user.id)
                .eq('processing_status', 'processing');

              if (pendingUploads && mountedRef.current) {
                pendingUploads.forEach(upload => {
                  startPolling(upload.id, (updatedUpload) => {
                    if (mountedRef.current) {
                      globalHandlers.forEach(({ handler }) => {
                        try {
                          handler({ new: updatedUpload, old: upload });
                        } catch (error) {
                          console.error('Error in polling handler:', error);
                        }
                      });
                    }
                  });
                });
              }
            } catch (error) {
              console.error('Error setting up polling fallback:', error);
            }
          }, 1000);
        }
      });
    } catch (error) {
      console.error('Error initializing connection:', error);
      isSubscribing = false;
      if (mountedRef.current) {
        setIsConnected(false);
      }
    }
  }, [user?.id, startPolling]);

  const cleanupConnection = useCallback(() => {
    console.log('📡 Cleaning up file upload connection');
    if (globalChannel) {
      try {
        supabase.removeChannel(globalChannel);
      } catch (error) {
        console.error('Error removing channel:', error);
      }
      globalChannel = null;
      globalUserId = null;
      isChannelSubscribed = false;
      subscriptionAttempts = 0;
      if (mountedRef.current) {
        setIsConnected(false);
      }
    }
    
    // Clean up all polling intervals
    Object.keys(pollingIntervals).forEach(uploadId => {
      clearInterval(pollingIntervals[uploadId]);
      delete pollingIntervals[uploadId];
    });
  }, []);

  // Initialize connection when user changes
  useEffect(() => {
    mountedRef.current = true;
    
    if (user?.id) {
      initializeConnection();
    }
    
    return () => {
      mountedRef.current = false;
      
      // Clean up local handlers on unmount
      handlersRef.current.forEach(({ id }) => {
        globalHandlers = globalHandlers.filter(h => h.id !== id);
      });
      
      // Clean up connection if no handlers left
      if (globalHandlers.length === 0) {
        cleanupConnection();
      }
    };
  }, [user?.id, initializeConnection, cleanupConnection]);

  return {
    subscribe,
    unsubscribe,
    isConnected,
    startPolling,
    stopPolling
  };
};

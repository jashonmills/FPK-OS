
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useCleanup } from '@/utils/cleanupManager';

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

export const useFileUploadSubscription = (): FileUploadSubscriptionService => {
  const cleanup = useCleanup('file-upload-subscription');
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const handlersRef = useRef<FileUploadUpdateHandler[]>([]);
  const mountedRef = useRef(true);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const pollingIntervalsRef = useRef<Record<string, string>>({});

  const subscribe = useCallback((id: string, handler: (payload: any) => void) => {
    if (!mountedRef.current) return;
    
    console.log(`📡 Subscribing handler: ${id}`);
    
    // Check if handler already exists
    const existingHandler = handlersRef.current.find(h => h.id === id);
    if (existingHandler) {
      console.log(`📡 Handler ${id} already exists, updating`);
      existingHandler.handler = handler;
      return;
    }
    
    // Add to local handlers
    const newHandler = { id, handler };
    handlersRef.current.push(newHandler);
    
    // Initialize connection if needed
    initializeConnection();
  }, []);

  const unsubscribe = useCallback((id: string) => {
    console.log(`📡 Unsubscribing handler: ${id}`);
    
    // Remove from local handlers
    handlersRef.current = handlersRef.current.filter(h => h.id !== id);
    
    // Clean up connection if no handlers left
    if (handlersRef.current.length === 0) {
      cleanupConnection();
    }
  }, []);

  const startPolling = useCallback((uploadId: string, callback: (upload: any) => void) => {
    if (!mountedRef.current) return;
    
    console.log(`🔄 Starting polling for upload: ${uploadId}`);
    
    if (pollingIntervalsRef.current[uploadId]) {
      cleanup.cleanup(pollingIntervalsRef.current[uploadId]);
    }

    const intervalId = cleanup.setInterval(async () => {
      if (!mountedRef.current) {
        cleanup.cleanup(pollingIntervalsRef.current[uploadId]);
        delete pollingIntervalsRef.current[uploadId];
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
          cleanup.cleanup(pollingIntervalsRef.current[uploadId]);
          delete pollingIntervalsRef.current[uploadId];
        }
      } catch (error) {
        console.error('❌ Polling fetch error:', error);
      }
    }, 3000);

    pollingIntervalsRef.current[uploadId] = intervalId;

    // Auto cleanup after 5 minutes
    cleanup.setTimeout(() => {
      if (pollingIntervalsRef.current[uploadId]) {
        console.log(`⏰ Polling timeout for ${uploadId}`);
        cleanup.cleanup(pollingIntervalsRef.current[uploadId]);
        delete pollingIntervalsRef.current[uploadId];
      }
    }, 300000);
  }, [cleanup]);

  const stopPolling = useCallback((uploadId: string) => {
    if (pollingIntervalsRef.current[uploadId]) {
      console.log(`🛑 Stopping polling for ${uploadId}`);
      cleanup.cleanup(pollingIntervalsRef.current[uploadId]);
      delete pollingIntervalsRef.current[uploadId];
    }
  }, [cleanup]);

  const initializeConnection = useCallback(() => {
    // Critical validation: ensure we have valid user ID before creating channels
    if (!user?.id || typeof user.id !== 'string' || !mountedRef.current) {
      console.warn('Invalid state for file upload subscription:', { userId: user?.id, mounted: mountedRef.current });
      return;
    }
    
    if (channelRef.current) {
      console.log('📡 File upload subscription already exists, skipping initialization');
      return; // Already have a connection
    }

    console.log('📡 Initializing file upload subscription connection');

    try {
      const channelName = `file-uploads-${user.id}`;
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
            
            console.log('📡 Broadcasting file upload update to handlers:', payload);
            
            // Notify all registered handlers for this instance
            handlersRef.current.forEach(({ id, handler }) => {
              try {
                handler(payload);
              } catch (error) {
                console.error(`📡 Error in handler ${id}:`, error);
              }
            });
          }
        );

      channelRef.current = channel;

      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ File upload subscription connected');
          if (mountedRef.current) {
            setIsConnected(true);
          }
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          console.warn('⚠️ File upload connection status:', status);
          if (mountedRef.current) {
            setIsConnected(false);
          }
          
          // Clean up the failed channel and use polling fallback
          if (channelRef.current) {
            try {
              supabase.removeChannel(channelRef.current);
            } catch (error) {
              // Silently handle cleanup errors
            }
            channelRef.current = null;
          }
          
          // Fallback: Start polling for all pending uploads
          console.log('🔄 Falling back to polling mode for file uploads');
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
                      handlersRef.current.forEach(({ handler }) => {
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
      if (mountedRef.current) {
        setIsConnected(false);
      }
    }
  }, [user?.id, startPolling]);

  const cleanupConnection = useCallback(() => {
    console.log('📡 Cleaning up file upload connection');
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.error('Error removing channel:', error);
      }
      channelRef.current = null;
      if (mountedRef.current) {
        setIsConnected(false);
      }
    }
    
    // Clean up all polling intervals
    Object.keys(pollingIntervalsRef.current).forEach(uploadId => {
      clearInterval(pollingIntervalsRef.current[uploadId]);
      delete pollingIntervalsRef.current[uploadId];
    });
    pollingIntervalsRef.current = {};
  }, []);

  // Initialize connection when user changes
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      cleanupConnection();
    };
  }, [cleanupConnection]);

  // Separate effect for user-dependent initialization
  useEffect(() => {
    if (user?.id && mountedRef.current) {
      initializeConnection();
    }
    
    return () => {
      // Cleanup on user change
      if (channelRef.current) {
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

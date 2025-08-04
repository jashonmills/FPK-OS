import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell, Info, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

const BetaUpdateListener: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();

  useEffect(() => {
    // Only listen for updates if user has beta access
    if (!user || !profile?.beta_access) {
      return;
    }

    console.log('Setting up beta update listener for user:', user.id);

    const channel = supabase
      .channel('beta_updates')
      .on(
        'broadcast',
        { event: 'beta_update' },
        (payload) => {
          console.log('Received beta update:', payload);
          
          const { title, message, type, timestamp } = payload.payload.data;
          
          // Get appropriate icon based on type
          const getIcon = () => {
            switch (type) {
              case 'success': return CheckCircle;
              case 'warning': return AlertTriangle;
              case 'feature': return Sparkles;
              default: return Info;
            }
          };

          const Icon = getIcon();

          // Show toast notification with custom styling
          toast(title, {
            description: message,
            icon: <Icon className="w-4 h-4" />,
            duration: 8000,
            action: {
              label: 'Dismiss',
              onClick: () => console.log('Dismissed beta update notification')
            },
            className: type === 'warning' ? 'border-orange-500' : 
                      type === 'success' ? 'border-green-500' :
                      type === 'feature' ? 'border-purple-500' : 'border-blue-500'
          });

          // Log the update for analytics
          console.log(`Beta update received at ${timestamp}:`, { title, message, type });
        }
      )
      .subscribe((status) => {
        console.log('Beta updates channel status:', status);
      });

    return () => {
      console.log('Cleaning up beta update listener');
      supabase.removeChannel(channel);
    };
  }, [user, profile?.beta_access]);

  return null; // This is a listener component, no UI needed
};

export default BetaUpdateListener;